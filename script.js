// الحصول على العناصر من HTML
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// التحقق من الوضع الليلي المحفوظ في التخزين المحلي (localStorage)
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
}

// إضافة حدث عند النقر على الزر
darkModeToggle.addEventListener('click', () => {
    // التبديل بين الوضعين
    body.classList.toggle('dark-mode');

    // حفظ الحالة في التخزين المحلي (localStorage) لمتابعة تذكر الوضع عند تحميل الصفحة
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

// التعامل مع مدخلات URL
document.getElementById("urlInput").addEventListener("input", async () => {
    const url = document.getElementById("urlInput").value.trim();
    const statusMessage = document.getElementById("statusMessage");
    const videoPreview = document.getElementById("videoPreview");
    const videoPlayer = document.getElementById("videoPlayer");

    // إعادة تعيين الرسائل والمعاينة
    statusMessage.textContent = "";
    videoPreview.style.display = "none";
    videoPlayer.src = "";

    // إذا كان الحقل فارغًا، لا يتم تنفيذ أي عملية
    if (!url) return;

    // قائمة المنصات المدعومة
    const supportedPlatforms = ["facebook.com", "tiktok.com", "tiktoklite.com", "instagram.com"];

    // التحقق من إذا ما كان الرابط ينتمي إلى المنصات المدعومة
    const isSupported = supportedPlatforms.some(platform => url.includes(platform));

    if (!isSupported) {
        statusMessage.textContent = "منصه غير مدعومه المنصات المدعومه هي:فيسبوك|تيك توك|انستاغرام";
        statusMessage.style.color = "white";
        return;
    }

    statusMessage.textContent = "جارٍ معالجة الرابط...";
    statusMessage.style.color = "blue";

    try {
        // استخدام API للحصول على بيانات الفيديو
        const apiURL = `https://bk9.fun/download/alldownload?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiURL);
        const json = await response.json();

        if (!json || json.status === false) {
            statusMessage.textContent = "الرابط تالف او لا يدعم التنزيل !";
            statusMessage.style.color = "red";
            return;
        }

        const videoUrl = json.BK9?.high || json.BK9?.low;
        if (!videoUrl) {
            statusMessage.textContent = "لم يتم العثور علي الفيديو من الرابط !";
            statusMessage.style.color = "red";
            return;
        }

        // عرض الفيديو
        videoPlayer.src = videoUrl;
        videoPreview.style.display = "block";
        statusMessage.textContent = "تم العثور علي الفيديو 🎉";
        statusMessage.style.color = "green";

        // تحميل الفيديو عند الضغط على "تحميل"
        document.getElementById("downloadBtn").onclick = async () => {
            const videoBlob = await fetch(videoUrl).then((res) => res.blob());
            const link = document.createElement("a");
            link.href = URL.createObjectURL(videoBlob);
            link.download = "media&m7d.mp4";
            link.click();
        };
    } catch (error) {
        console.error("حدث خطأ:", error);
        statusMessage.textContent = "حدث خطأ اثناء المعالجه";
        statusMessage.style.color = "red";
    }
});

// إظهار القائمة الجانبية عند الضغط على زر ☰
document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("sidebar").style.left = "0";
    document.getElementById("overlay").style.display = "block";
});

// إغلاق القائمة الجانبية
document.getElementById("closeSidebar").addEventListener("click", () => {
    document.getElementById("sidebar").style.left = "-250px";
    document.getElementById("overlay").style.display = "none";
});

// إغلاق المربع المنبثق لسياسة الخصوصية
document.getElementById("privacyPolicyLink").addEventListener("click", () => {
    document.getElementById("privacyPolicyModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});

// إغلاق مربع سياسة الخصوصية
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("privacyPolicyModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
});