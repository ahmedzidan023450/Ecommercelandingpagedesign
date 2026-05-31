using Furniture_E_Commerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Furniture_E_Commerce.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<FinancialRecord> FinancialRecords { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========================= CATEGORY =========================
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasIndex(c => c.Name).IsUnique();

                entity.Property(c => c.Description)
                      .HasMaxLength(500);
            });

            // ========================= PRODUCT =========================
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(p => p.Description)
                      .HasMaxLength(2000);

                entity.Property(p => p.Price)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();

                entity.Property(p => p.StockQuantity)
                      .IsRequired();

                entity.HasIndex(p => p.Name);
                entity.HasIndex(p => p.CategoryId);

                entity.HasOne(p => p.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(p => p.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(p => p.Discount)
                      .WithMany(d => d.Products)
                      .HasForeignKey(p => p.DiscountId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ========================= PRODUCT IMAGE =========================
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasKey(pi => pi.Id);

                entity.Property(pi => pi.Url)
                      .IsRequired();

                entity.HasIndex(pi => pi.ProductId);

                entity.HasOne(pi => pi.Product)
                      .WithMany(p => p.Images)
                      .HasForeignKey(pi => pi.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ========================= USER =========================
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.FullName)
                      .IsRequired()
                      .HasMaxLength(150);

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(u => u.PasswordHash)
                      .IsRequired();

                entity.Property(u => u.PhoneNumber)
                      .HasMaxLength(20);

                entity.HasIndex(u => u.Email).IsUnique();
            });

            // ========================= ORDER =========================
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);

                entity.Property(o => o.TotalAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(o => o.Status)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.HasIndex(o => o.UserId);
                entity.HasIndex(o => o.PlacedAt);

                entity.HasOne(o => o.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(o => o.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ========================= ORDER ITEM =========================
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);

                entity.Property(oi => oi.Quantity)
                      .IsRequired();

                entity.Property(oi => oi.UnitPrice)
                      .HasColumnType("decimal(18,2)");

                entity.HasIndex(oi => oi.OrderId);
                entity.HasIndex(oi => oi.ProductId);

                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.Items)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(oi => oi.Product)
                      .WithMany(p => p.OrderItems)
                      .HasForeignKey(oi => oi.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ========================= CART =========================
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.HasIndex(c => c.UserId).IsUnique();

                entity.HasOne(c => c.User)
                      .WithOne(u => u.Cart)
                      .HasForeignKey<Cart>(c => c.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ========================= CART ITEM =========================
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(ci => ci.Id);

                entity.Property(ci => ci.Quantity).IsRequired();

                entity.HasIndex(ci => ci.CartId);
                entity.HasIndex(ci => ci.ProductId);

                entity.HasOne(ci => ci.Cart)
                      .WithMany(c => c.Items)
                      .HasForeignKey(ci => ci.CartId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ci => ci.Product)
                      .WithMany(p => p.CartItems)
                      .HasForeignKey(ci => ci.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ========================= REVIEW =========================
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.Id);

                entity.Property(r => r.Comment)
                      .HasMaxLength(1000);

                entity.Property(r => r.Rating).IsRequired();

                entity.HasCheckConstraint(
                    "CK_Review_Rating",
                    "[Rating] >= 1 AND [Rating] <= 5"
                );

                entity.HasIndex(r => r.ProductId);
                entity.HasIndex(r => r.UserId);

                entity.HasOne(r => r.Product)
                      .WithMany(p => p.Reviews)
                      .HasForeignKey(r => r.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.User)
                      .WithMany(u => u.Reviews)
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ========================= DISCOUNT =========================
            modelBuilder.Entity<Discount>(entity =>
            {
                entity.ToTable("Discounts", table =>
                {
                    table.HasCheckConstraint("CK_Discounts_Value", "[Value] > 0");
                    table.HasCheckConstraint("CK_Discounts_Dates", "[EndDate] > [StartDate]");
                });

                entity.HasKey(d => d.Id);

                entity.Property(d => d.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasIndex(d => d.Name);

                entity.Property(d => d.Value)
                      .HasColumnType("decimal(18,2)");

                entity.Property(d => d.IsActive)
                      .HasDefaultValue(true);

                entity.Property(d => d.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");

                entity.HasMany(d => d.Products)
                      .WithOne(p => p.Discount)
                      .HasForeignKey(p => p.DiscountId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // ========================= PAYMENT =========================
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Amount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(p => p.Method)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(p => p.Status)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.HasIndex(p => p.OrderId).IsUnique();

                entity.HasOne(p => p.Order)
                      .WithOne(o => o.Payment)
                      .HasForeignKey<Payment>(p => p.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}