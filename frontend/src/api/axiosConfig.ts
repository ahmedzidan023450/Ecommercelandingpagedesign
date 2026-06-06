import axios from 'axios';
import toast from 'react-hot-toast';

// 1. تحديد الـ Base URL
// الدوكيومنتيشن بيقول إن الـ baseURL هو https://api.yourapp.com بس طبعاً في التطوير المحلي هيكون مختلف
// الأفضل دايماً نستخدم متغيرات البيئة (.env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5150';

const apiClient = axios.create({
    baseURL: API_URL,
    // ⚠️ مسحنا الـ 'Content-Type': 'application/json' من هنا!
    // ليه؟ لأنك في إضافة المنتجات بتحتاج تبعت صور (IFormFile)
    // لو سيبناها، Axios مش هيعرف يرفع الصور. لما تمسحها، Axios بيبقى ذكي:
    // لو بعت JSON هيحط application/json، ولو بعت FormData هيحط multipart/form-data لوحده.
});

// 2. Request Interceptor (المفتش اللي بيحط الـ Token قبل ما الطلب يخرج)
apiClient.interceptors.request.use(
    (config) => {
        // بنجيب التوكن من التخزين المحلي
        const token = localStorage.getItem('token');

        // لو التوكن موجود، بنحطه في الهيدر زي ما الدوكيومنتيشن طالب بالظبط
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('unauthorized')); // سيقوم AuthContext بالتقاط هذا الحدث وتوجيه المستخدم
            }

            else if (error.response.status >= 500) {
                const errorMessage = error.response.data.message || error.response.data.title || "الرجاء المحاولة لاحقاً";
                toast.error(`حدث خطأ في الخادم: ${errorMessage}`);
            }
        }
        return Promise.reject(error);
    }
);
export default apiClient;