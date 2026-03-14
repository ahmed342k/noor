const XR_DEFAULT_PRODUCTS = [
  {
    id: 1,
    name_ar: 'مبرد هاتف XR AirCool',
    name_ku: 'ساردکەرەوەی مۆبایل XR AirCool',
    category: 'coolers',
    price: 19,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=900&q=80',
    description_ar: 'مبرد خفيف وهادئ يساعد على تقليل حرارة الهاتف أثناء اللعب أو الشحن.',
    description_ku: 'ساردکەرەوەیەکی سووک و ئارام کە گەرمی مۆبایل کەم دەکاتەوە لە کاتی یاری یان شارجکردن.',
    features_ar: ['تشغيل USB', 'صوت منخفض', 'مناسب للألعاب'],
    features_ku: ['کارکردن بە USB', 'دەنگی کەم', 'گونجاو بۆ یاری'],
    sizes: ''
  },
  {
    id: 2,
    name_ar: 'كفر شفاف مقاوم للصدمات',
    name_ku: 'کاڤەری ڕوون و بەرگری لە لێدان',
    category: 'cases',
    price: 12,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80',
    description_ar: 'كفر بسيط وأنيق يحمي الهاتف مع إبراز لونه الأصلي.',
    description_ku: 'کاڤەرێکی سادە و جوان کە مۆبایل پاراستوو دەکات و ڕەنگە ڕەسەنەکەی پیشان دەدات.',
    features_ar: ['حواف معززة', 'خفيف', 'شفاف'],
    features_ku: ['کنارە بەهێزەکان', 'سووک', 'ڕوون'],
    sizes: 'iPhone / Samsung / Xiaomi'
  },
  {
    id: 3,
    name_ar: 'سماعة بلوتوث MiniPods',
    name_ku: 'گوێگرەی بلوتوث MiniPods',
    category: 'audio',
    price: 28,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    description_ar: 'سماعة لاسلكية بتصميم مريح وصوت نقي للاستخدام اليومي.',
    description_ku: 'گوێگرەی بێ وایەر بە دیزاینێکی ئارام و دەنگی پاک بۆ بەکارهێنانی ڕۆژانە.',
    features_ar: ['بلوتوث 5.3', 'شحن سريع', 'ميكروفون'],
    features_ku: ['بلوتوث 5.3', 'شارجکردنی خێرا', 'مایکڕۆفۆن'],
    sizes: ''
  },
  {
    id: 4,
    name_ar: 'شاحن سريع 25W',
    name_ku: 'شارجەری خێرای 25W',
    category: 'chargers',
    price: 15,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=900&q=80',
    description_ar: 'شاحن سريع وآمن للهواتف والأجهزة البسيطة.',
    description_ku: 'شارجەرێکی خێرا و پارێزراو بۆ مۆبایل و ئامێرە سادەکان.',
    features_ar: ['حماية حرارة', 'Type-C', 'حجم صغير'],
    features_ku: ['پاراستنی گەرمی', 'Type-C', 'قەبارەی بچووک'],
    sizes: ''
  },
  {
    id: 5,
    name_ar: 'ستاند هاتف معدني',
    name_ku: 'ستاندی مۆبایلی مەعدەنی',
    category: 'stands',
    price: 10,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=900&q=80',
    description_ar: 'ستاند عملي للمكتب أو الطاولة مع زاوية مشاهدة مريحة.',
    description_ku: 'ستاندێکی کارا بۆ مێز یان سەر مێز بە گۆشەی بینینێکی ئارام.',
    features_ar: ['معدني', 'قابل للطي', 'ثابت'],
    features_ku: ['مەعدەنی', 'قابل بۆ تاوکردن', 'جێگیر'],
    sizes: ''
  },
  {
    id: 6,
    name_ar: 'كابل شحن قوي 1 متر',
    name_ku: 'کێبڵی شارجی بەهێز 1 مەتر',
    category: 'chargers',
    price: 8,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1580894894513-fafe0e41ce71?auto=format&fit=crop&w=900&q=80',
    description_ar: 'كابل متين مناسب للشحن ونقل البيانات.',
    description_ku: 'کێبڵێکی پتەو گونجاو بۆ شارجکردن و گواستنەوەی داتا.',
    features_ar: ['سريع', 'مقاوم للثني', 'طول مناسب'],
    features_ku: ['خێرا', 'بەرگری لە چەمین', 'درێژی گونجاو'],
    sizes: '1m'
  }
];

const XR_CATEGORIES = {
  all: { ar: 'الكل', ku: 'هەموو' },
  coolers: { ar: 'مبردات', ku: 'ساردکەرەوە' },
  cases: { ar: 'كفرات', ku: 'کاڤەر' },
  audio: { ar: 'سماعات', ku: 'گوێگرە' },
  chargers: { ar: 'شواحن', ku: 'شارجەر' },
  stands: { ar: 'ستاندات', ku: 'ستاند' }
};
