/**
 * Rich, static content for the service detail pages. Kept in code (not the DB)
 * so the pages render fully without setup; the admin's ServicePage model can
 * later override the short description shown in listings.
 */

export type ServiceDetail = {
  key: "EDITORLUK" | "DIZGI" | "KAPAK_TASARIMI";
  slug: string;
  title: string;
  tagline: string;
  description: string;
  intro: string;
  features: { title: string; text: string }[];
  process: { step: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    key: "EDITORLUK",
    slug: "editorluk",
    title: "Editörlük",
    tagline: "Metninizin en güçlü hâli",
    description:
      "Metninizi profesyonel editörlük ve redaksiyon süreçlerinden geçirerek anlatım gücünü artırıyor, dil ve imla hatalarını gideriyor, eserinizi yayın standartlarına uygun hâle getiriyoruz.",
    intro:
      "Editörlük, bir metni yalnızca hatalardan arındırmak değil; onu en güçlü, en akıcı ve en tutarlı hâline taşımaktır. Yazarın sesini koruyarak eserin potansiyelini ortaya çıkarırız.",
    features: [
      {
        title: "İçerik Editörlüğü",
        text: "Anlatının yapısı, kurgu bütünlüğü ve akış üzerinde bütünsel bir değerlendirme yaparız.",
      },
      {
        title: "Redaksiyon & Düzelti",
        text: "Dil, imla, noktalama ve anlatım düzeyinde titiz bir son okuma gerçekleştiririz.",
      },
      {
        title: "Üslup Tutarlılığı",
        text: "Eser boyunca üslubun, terminolojinin ve karakterlerin tutarlı kalmasını sağlarız.",
      },
      {
        title: "Yayın Standartları",
        text: "Metni, yayınevlerinin gözettiği içerik ve biçim standartlarına uygun hâle getiririz.",
      },
    ],
    process: [
      { step: "01", title: "Değerlendirme", text: "Metni baştan sona okuyup güçlü ve geliştirilmeye açık yönleri belirleriz." },
      { step: "02", title: "Editörlük", text: "Yapı, akış ve anlatım üzerinde önerilerle birlikte çalışırız." },
      { step: "03", title: "Redaksiyon", text: "Dil ve imla düzeyinde detaylı bir düzelti uygularız." },
      { step: "04", title: "Son Okuma", text: "Eseri yayına hazır hâle getiren son kontrolü yaparız." },
    ],
    faqs: [
      { q: "Editörlük ile redaksiyon arasındaki fark nedir?", a: "Redaksiyon dil ve imla düzeyinde; editörlük ise metnin yapısı, akışı ve anlatım gücü düzeyinde çalışır. Profesyonel süreçte her ikisi de ele alınır." },
      { q: "Yazarın üslubuna müdahale ediyor musunuz?", a: "Hayır. Amacımız yazarın sesini korumak; öneriler her zaman yazarın onayıyla uygulanır." },
    ],
  },
  {
    key: "DIZGI",
    slug: "dizgi",
    title: "Dizgi",
    tagline: "Okumanın görünmeyen mimarisi",
    description:
      "Kitabınızı profesyonel yayıncılık standartlarına uygun şekilde diziyor, okunabilirliği ve görsel düzeni en üst seviyeye taşıyoruz.",
    intro:
      "Dizgi, bir kitabın görünmeyen mimarisidir. Doğru tipografi, dengeli sayfa düzeni ve özenli boşluk kullanımı, okuma deneyimini doğrudan belirler.",
    features: [
      { title: "Tipografi", text: "Eserin türüne uygun, gözü yormayan yazı tipi ve boyut dengesini kurarız." },
      { title: "Sayfa Düzeni", text: "Kenar boşlukları, satır aralığı ve sütun yapısını okunabilirlik için optimize ederiz." },
      { title: "Bölüm & Başlıklar", text: "Bölüm başlangıçları, başlık hiyerarşisi ve sayfa numaralandırmasını tutarlı kurgularız." },
      { title: "Baskıya Hazırlık", text: "Dosyayı matbaa standartlarına uygun, baskıya hazır formatta teslim ederiz." },
    ],
    process: [
      { step: "01", title: "Şablon", text: "Eserin türüne uygun bir sayfa şablonu ve tipografi sistemi oluştururuz." },
      { step: "02", title: "Akıtma", text: "Metni şablona aktarır, düzeni sayfa sayfa kurgularız." },
      { step: "03", title: "İnce Ayar", text: "Dul/yetim satırlar, tireleme ve boşlukları titizlikle düzeltiriz." },
      { step: "04", title: "Teslim", text: "Baskıya hazır PDF ve gerekli kaynak dosyaları teslim ederiz." },
    ],
    faqs: [
      { q: "Hangi formatta teslim alıyorsunuz?", a: "Word (DOCX) veya benzeri düzenlenebilir formatlar idealdir. Baskıya hazır PDF olarak teslim ederiz." },
      { q: "Görseller ve tablolar dizilebiliyor mu?", a: "Evet. Görsel, tablo ve dipnot içeren eserler de yayın standartlarında dizilir." },
    ],
  },
  {
    key: "KAPAK_TASARIMI",
    slug: "kapak-tasarimi",
    title: "Kapak Tasarımı",
    tagline: "İlk izlenimin gücü",
    description:
      "Eserinizin ruhunu yansıtan, dikkat çekici ve özgün kapak tasarımları hazırlayarak kitabınızı okuyucuyla buluşturuyoruz.",
    intro:
      "Kapak, okurla kurulan ilk temastır. Eserin türünü, atmosferini ve duygusunu tek bir görselde aktaran özgün tasarımlar hazırlarız.",
    features: [
      { title: "Özgün Konsept", text: "Eserin ruhunu yansıtan, size özel ve özgün bir tasarım dili geliştiririz." },
      { title: "Tipografi & Renk", text: "Başlık tipografisi ve renk paletini eserin kimliğiyle uyumlu kurgularız." },
      { title: "Ön / Arka / Sırt", text: "Tam kapak (ön, sırt, arka) tasarımını baskı ölçülerine uygun hazırlarız." },
      { title: "Dijital & Baskı", text: "Hem e-kitap kapağı hem de baskıya hazır yüksek çözünürlüklü dosyalar sunarız." },
    ],
    process: [
      { step: "01", title: "Brief", text: "Eserin türü, hedef kitlesi ve beklentilerinizi birlikte netleştiririz." },
      { step: "02", title: "Konsept", text: "Birden fazla taslak yön sunar, birlikte en uygununu seçeriz." },
      { step: "03", title: "Tasarım", text: "Seçilen konsepti detaylandırıp revizyonlarla olgunlaştırırız." },
      { step: "04", title: "Teslim", text: "Baskı ve dijital kullanım için tüm dosya formatlarını teslim ederiz." },
    ],
    faqs: [
      { q: "Kaç revizyon hakkı var?", a: "Süreç boyunca, seçilen konsept üzerinde makul sayıda revizyonla en iyi sonuca ulaşırız." },
      { q: "Baskıya hazır dosya veriyor musunuz?", a: "Evet. Matbaanın istediği ölçü, taşma payı ve çözünürlükte baskıya hazır dosya teslim ederiz." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return serviceDetails.find((s) => s.slug === slug);
}
