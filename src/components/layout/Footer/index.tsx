import Link from "next/link";
import {
  Briefcase,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function Footer() {
  const footerLinks = {
    "Для пошукачів": [
      { label: "Перегляд вакансій", href: "/jobs" },
      { label: "Карʼєрні ресурси", href: "/resources" },
      { label: "Конструктор резюме", href: "/resume-builder" },
      { label: "Сповіщення про вакансії", href: "/job-alerts" },
    ],
    "Для роботодавців": [
      { label: "Опублікувати вакансію", href: "/post-job" },
      { label: "Пошук кандидатів", href: "/candidates" },
      { label: "Рекрутингові рішення", href: "/solutions" },
      { label: "Ціни", href: "/pricing" },
    ],
    Компанія: [
      { label: "Про нас", href: "/about" },
      { label: "Контакти", href: "/contact" },
      { label: "Політика конфіденційності", href: "/privacy" },
      { label: "Умови використання", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип і соцмережі */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">HireZone</span>
            </Link>
            <p className="text-gray-600">
              Поєднуємо таланти з можливостями в усьому світі.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook className="h-5 w-5" />, href: "#" },
                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Посилання */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} HireZone. Всі права захищено.
          </p>
        </div>
      </div>
    </footer>
  );
}
