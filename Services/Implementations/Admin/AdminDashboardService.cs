using Furniture_E_Commerce.DTOs.Dashboard;
using Furniture_E_Commerce.DTOs.Financial;
using Furniture_E_Commerce.Models.Enums;
using Furniture_E_Commerce.Repositories.Interfaces;
using Furniture_E_Commerce.Services.Interfaces.Admin;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Furniture_E_Commerce.Services.Implementations.Admin
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IUserRepository _userRepo;
        private readonly IProductRepository _productRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IFinancialRecordRepository _financialRepo;

        public AdminDashboardService(
            IUserRepository userRepo,
            IProductRepository productRepo,
            IOrderRepository orderRepo,
            IFinancialRecordRepository financialRepo)
        {
            _userRepo = userRepo;
            _productRepo = productRepo;
            _orderRepo = orderRepo;
            _financialRepo = financialRepo;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalUsers = await _userRepo.CountAsync();
            var totalOrders = await _orderRepo.CountAsync();
            var totalProducts = await _productRepo.CountAsync();

            var totalRevenue = await _financialRepo.Query()
                .AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Revenue)
                .SumAsync(f => f.Amount);

            var totalExpenses = await _financialRepo.Query()
                .AsNoTracking()
                .Where(f => f.Type == FinancialRecordType.Expense)
                .SumAsync(f => f.Amount);

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalRevenue = totalRevenue,
                TotalExpenses = totalExpenses,
                NetProfit = totalRevenue - totalExpenses
            };
        }

        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(
            int months = 12)
        {
            return await _financialRepo.GetMonthlyRevenueAsync(months);
        }

        public async Task<byte[]> ExportDashboardPdfAsync()
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var stats = await GetDashboardStatsAsync();
            var revenues = await GetMonthlyRevenueAsync();

            var primaryColor = "#162556";
            var secondaryColor = "#e17100";

            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(14));

                    // HEADER
                    page.Header().Column(header =>
                    {
                        header.Item().AlignCenter()
                            .Text("شركة رؤية للأثاث")
                            .FontSize(28).Bold().FontColor(primaryColor);

                        header.Item().AlignCenter()
                            .Text("تقرير لوحة التحكم")
                            .FontSize(18).FontColor(secondaryColor);

                        header.Item().PaddingTop(10);
                        header.Item().LineHorizontal(1).LineColor(primaryColor);
                    });

                    // CONTENT
                    page.Content().PaddingVertical(20).Column(col =>
                    {
                        // Stats
                        col.Item().Text("الإحصائيات العامة")
                            .FontSize(20).Bold().FontColor(primaryColor);
                        col.Item().PaddingTop(10);

                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.RelativeColumn();
                            });

                            table.Cell().Element(x => CellStyleHeader(x, primaryColor))
                                .Text("البيان").FontColor(Colors.White);
                            table.Cell().Element(x => CellStyleHeader(x, primaryColor))
                                .Text("القيمة").FontColor(Colors.White);

                            AddRow(table, "إجمالي المستخدمين", stats.TotalUsers.ToString());
                            AddRow(table, "إجمالي الطلبات", stats.TotalOrders.ToString());
                            AddRow(table, "إجمالي المنتجات", stats.TotalProducts.ToString());
                            AddRow(table, "إجمالي الإيرادات", $"{stats.TotalRevenue:N2} جنيه");
                            AddRow(table, "إجمالي المصروفات", $"{stats.TotalExpenses:N2} جنيه");
                            AddRow(table, "صافي الربح", $"{stats.NetProfit:N2} جنيه");
                        });

                        // Monthly Revenue
                        col.Item().PaddingTop(30);
                        col.Item().Text("الإيرادات الشهرية")
                            .FontSize(20).Bold().FontColor(primaryColor);
                        col.Item().PaddingTop(10);

                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.RelativeColumn();
                            });

                            table.Cell().Element(x => CellStyleHeader(x, secondaryColor))
                                .Text("الشهر").FontColor(Colors.White);
                            table.Cell().Element(x => CellStyleHeader(x, secondaryColor))
                                .Text("الإيراد").FontColor(Colors.White);

                            foreach (var item in revenues)
                            {
                                table.Cell().Element(CellStyleBody).Text(item.MonthName);
                                table.Cell().Element(CellStyleBody)
                                    .Text($"{item.Revenue:N2} جنيه");
                            }
                        });
                    });

                    // FOOTER
                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("تم إنشاء التقرير بتاريخ: ");
                        text.Span(DateTime.Now.ToString("yyyy-MM-dd HH:mm"));
                    });
                });
            });

            return pdf.GeneratePdf();
        }

        // Helpers
        private static void AddRow(TableDescriptor table, string title, string value)
        {
            table.Cell().Element(CellStyleBody).Text(title);
            table.Cell().Element(CellStyleBody).Text(value);
        }

        private static IContainer CellStyleHeader(IContainer container, string color)
            => container.Background(color).Border(1)
                        .BorderColor(Colors.White).Padding(10);

        private static IContainer CellStyleBody(IContainer container)
            => container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(10);
    }
}