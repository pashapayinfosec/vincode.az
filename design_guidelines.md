{
  "brand": {
    "name": "VINCHECK",
    "tagline": "AVTOVIN YOXLAMA",
    "language": "az",
    "personality": [
      "peşəkar və etibarlı",
      "avtomobil-texniki (industrial)",
      "premium (qızılı vurğular)",
      "sürətli və aydın (mobil-first)"
    ],
    "do_not": [
      "Bənövşəyi/pink gradientlər",
      "Mətn oxunan sahələrdə gradient",
      "Həddindən artıq parıltı / neon",
      "Mərkəzə tam hizalanmış uzun mətn blokları"
    ]
  },

  "design_tokens": {
    "notes": "Dark-only. Tailwind + shadcn/ui CSS variables (HSL) istifadə edin. :root tokenlərini dark palitraya uyğun yeniləyin və .dark toggle-a ehtiyac yaratmayın (app default dark).",

    "colors": {
      "background": {
        "base_hex": "#0F0F10",
        "elevated_hex": "#141416",
        "panel_hex": "#17181B",
        "soft_hex": "#1C1D21",
        "description": "Çox tünd, azca isti tonlu qara. Kartlar üçün 1-2 pillə açıq səthlər."
      },
      "text": {
        "primary_hex": "#F2F2F2",
        "secondary_hex": "#C9CBD1",
        "muted_hex": "#9AA0AA",
        "inverse_hex": "#0F0F10"
      },
      "accent_gold": {
        "primary_hex": "#F5C84B",
        "deep_hex": "#D9A928",
        "soft_hex": "#FFE7A3",
        "ring_hex": "#F5C84B",
        "usage": "CTA, aktiv tab, seçilmiş state, əsas metric highlight."
      },
      "status": {
        "success_hex": "#2BD576",
        "warning_hex": "#F5C84B",
        "danger_hex": "#FF4D4D",
        "info_hex": "#4DA3FF"
      },
      "borders": {
        "subtle_hex": "#24262B",
        "gold_border_hex": "#3A2F12",
        "divider_hex": "#1F2126"
      },
      "shadows": {
        "soft": "0 10px 30px rgba(0,0,0,0.45)",
        "lift": "0 18px 60px rgba(0,0,0,0.55)",
        "gold_glow": "0 0 0 1px rgba(245,200,75,0.22), 0 10px 30px rgba(245,200,75,0.08)"
      }
    },

    "css_variables_patch_for_index_css": {
      "instruction": "frontend/src/index.css içində @layer base :root tokenlərini aşağıdakı HSL-lərlə əvəz edin. App dark-only olduğuna görə .dark blokunu ya silin, ya da eyni dəyərlərlə saxlayın.",
      "variables_hsl": {
        "--background": "240 3% 6%",
        "--foreground": "0 0% 95%",
        "--card": "240 4% 9%",
        "--card-foreground": "0 0% 95%",
        "--popover": "240 4% 9%",
        "--popover-foreground": "0 0% 95%",
        "--primary": "44 90% 63%",
        "--primary-foreground": "240 6% 10%",
        "--secondary": "240 4% 13%",
        "--secondary-foreground": "0 0% 95%",
        "--muted": "240 4% 13%",
        "--muted-foreground": "220 7% 70%",
        "--accent": "240 4% 13%",
        "--accent-foreground": "0 0% 95%",
        "--destructive": "0 84% 58%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "240 4% 16%",
        "--input": "240 4% 16%",
        "--ring": "44 90% 63%",
        "--radius": "0.75rem",
        "--chart-1": "44 90% 63%",
        "--chart-2": "142 62% 48%",
        "--chart-3": "206 86% 62%",
        "--chart-4": "0 84% 58%",
        "--chart-5": "220 7% 70%"
      }
    },

    "typography": {
      "font_pairing": {
        "display": {
          "name": "Space Grotesk",
          "google_fonts": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
          "usage": "Hero başlıq, page title, admin dashboard KPI başlıqları"
        },
        "body": {
          "name": "Inter",
          "google_fonts": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
          "usage": "Form label, body copy, table text"
        },
        "mono": {
          "name": "IBM Plex Mono",
          "google_fonts": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
          "usage": "VIN kodu, tracking code, order id"
        }
      },
      "scale": {
        "h1": "text-4xl sm:text-5xl lg:text-6xl",
        "h2": "text-base md:text-lg",
        "body": "text-sm sm:text-base",
        "small": "text-xs sm:text-sm"
      },
      "tracking": {
        "hero": "tracking-[-0.02em]",
        "kpi": "tracking-[-0.01em]",
        "mono": "tracking-[0.02em]"
      }
    },

    "spacing_and_layout": {
      "grid": {
        "container": "max-w-6xl mx-auto px-4 sm:px-6",
        "admin_container": "max-w-7xl mx-auto px-4 sm:px-6",
        "section_padding": "py-10 sm:py-14 lg:py-18",
        "card_padding": "p-4 sm:p-6",
        "form_gap": "gap-4 sm:gap-5"
      },
      "layout_principles": [
        "Landing: Z-pattern hero + 3 addım 'Necə işləyir' + sosial sübut + CTA",
        "Order flow: 1 sütun (mobil), 2 sütun (desktop) — solda form, sağda xülasə kartı",
        "Admin: sol sidebar (desktop), mobil üçün Sheet drawer; əsas sahə cards + table"
      ]
    },

    "radius_and_borders": {
      "radius": {
        "sm": "rounded-md",
        "md": "rounded-xl",
        "lg": "rounded-2xl"
      },
      "border_styles": {
        "default": "border border-border",
        "gold_outline": "border border-[rgba(245,200,75,0.22)]",
        "gold_hairline": "ring-1 ring-[rgba(245,200,75,0.18)]"
      }
    }
  },

  "visual_style": {
    "background_treatments": {
      "grid_texture": {
        "description": "Subtle grid texture (reference screenshot vibe). 8px/12px grid, 6–10% opacity. Mətn oxunan sahələrdə yox, yalnız page background-da.",
        "tailwind_scaffold": "relative bg-background before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] before:bg-[size:28px_28px] before:opacity-20"
      },
      "noise_overlay": {
        "description": "Çox yüngül grain/noise overlay (flat görünməsin).",
        "implementation": "CSS pseudo-element ilə base64 noise və ya repeating-radial-gradient. Opacity 0.06–0.10 arası.",
        "tailwind_scaffold": "after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.08] after:mix-blend-overlay after:bg-[url('/noise.png')]"
      }
    },
    "gradient_policy": {
      "allowed": "Yalnız hero section background overlay kimi (viewport-un max 20%-i). Qızılı gradientlər çox yüngül olmalıdır.",
      "safe_gradients": [
        "radial-gradient(600px circle at 20% 10%, rgba(245,200,75,0.14), transparent 55%)",
        "radial-gradient(700px circle at 80% 0%, rgba(77,163,255,0.10), transparent 60%)"
      ],
      "never": [
        "blue-500 to purple-600",
        "purple-500 to pink-500",
        "green-500 to blue-500",
        "red to pink",
        "small UI element gradients (<100px)",
        "text-heavy areas"
      ]
    }
  },

  "components": {
    "component_path": {
      "button": "/app/frontend/src/components/ui/button.jsx",
      "card": "/app/frontend/src/components/ui/card.jsx",
      "input": "/app/frontend/src/components/ui/input.jsx",
      "label": "/app/frontend/src/components/ui/label.jsx",
      "textarea": "/app/frontend/src/components/ui/textarea.jsx",
      "select": "/app/frontend/src/components/ui/select.jsx",
      "radio_group": "/app/frontend/src/components/ui/radio-group.jsx",
      "checkbox": "/app/frontend/src/components/ui/checkbox.jsx",
      "tabs": "/app/frontend/src/components/ui/tabs.jsx",
      "table": "/app/frontend/src/components/ui/table.jsx",
      "badge": "/app/frontend/src/components/ui/badge.jsx",
      "dialog": "/app/frontend/src/components/ui/dialog.jsx",
      "sheet": "/app/frontend/src/components/ui/sheet.jsx",
      "drawer": "/app/frontend/src/components/ui/drawer.jsx",
      "pagination": "/app/frontend/src/components/ui/pagination.jsx",
      "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx",
      "calendar": "/app/frontend/src/components/ui/calendar.jsx",
      "skeleton": "/app/frontend/src/components/ui/skeleton.jsx",
      "progress": "/app/frontend/src/components/ui/progress.jsx",
      "tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
      "breadcrumb": "/app/frontend/src/components/ui/breadcrumb.jsx",
      "navigation_menu": "/app/frontend/src/components/ui/navigation-menu.jsx",
      "dropdown_menu": "/app/frontend/src/components/ui/dropdown-menu.jsx"
    },

    "buttons": {
      "style": "Professional / Corporate + premium gold",
      "tokens": {
        "--btn-radius": "12px",
        "--btn-shadow": "0 10px 30px rgba(0,0,0,0.45)",
        "--btn-press-scale": "0.98"
      },
      "variants": {
        "primary": {
          "usage": "Ödəniş et / Sifariş ver / Hesabatı göndər",
          "classes": "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary)/0.92)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "micro_interaction": "hover: yüngül parıltı (shadow), active: scale-98"
        },
        "secondary": {
          "usage": "Geri / Ləğv et",
          "classes": "bg-secondary text-secondary-foreground hover:bg-[hsl(var(--secondary)/0.85)] border border-border"
        },
        "ghost": {
          "usage": "Cədvəldə actions, link-like",
          "classes": "hover:bg-accent hover:text-accent-foreground"
        },
        "danger": {
          "usage": "Sifarişi sil",
          "classes": "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)]"
        }
      },
      "data_testid_examples": [
        "data-testid=\"hero-primary-cta-button\"",
        "data-testid=\"order-form-submit-button\"",
        "data-testid=\"payment-paypal-mock-button\"",
        "data-testid=\"admin-order-send-result-button\""
      ]
    },

    "forms": {
      "vin_input": {
        "pattern": "17 simvol, A-H J-N P-R S-Z və 0-9 (I,O,Q yoxdur).",
        "ui": "Input + mono font + helper text + inline validation",
        "classes": "font-mono uppercase tracking-[0.08em]",
        "helper": "Məs: WDB1234561A654321",
        "data_testid": "order-form-vin-input"
      },
      "sections": [
        {
          "title": "Avtomobil məlumatları",
          "fields": ["VIN", "Marka", "Model", "İl"],
          "layout": "grid grid-cols-1 sm:grid-cols-2 gap-4"
        },
        {
          "title": "Əlaqə məlumatları",
          "fields": ["Ad Soyad", "Telefon", "E-poçt"],
          "layout": "grid grid-cols-1 sm:grid-cols-2 gap-4"
        },
        {
          "title": "Çatdırılma",
          "fields": ["Email", "Telegram"],
          "component": "radio-group",
          "note": "Telegram hazırdır, amma aktiv deyil — UI-də 'tezliklə' badge göstər."
        }
      ],
      "error_states": {
        "rule": "Error text həmişə görünən olmalı, yalnız rənglə yox; ikon + mətn.",
        "classes": "text-[color:var(--danger)] text-sm",
        "toast": "sonner ilə form submit error"
      }
    },

    "cards_and_tables": {
      "card_style": {
        "classes": "bg-card text-card-foreground rounded-2xl border border-[rgba(245,200,75,0.14)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
        "header": "Space Grotesk 600",
        "body": "Inter 400/500"
      },
      "table_style": {
        "usage": "Admin Orders, Customers, Payments",
        "classes": "rounded-xl border border-border overflow-hidden",
        "row_hover": "hover:bg-[rgba(245,200,75,0.06)]",
        "status_badges": {
          "new": "bg-[rgba(77,163,255,0.14)] text-[#BBD9FF] border border-[rgba(77,163,255,0.22)]",
          "paid": "bg-[rgba(245,200,75,0.14)] text-[#FFE7A3] border border-[rgba(245,200,75,0.22)]",
          "completed": "bg-[rgba(43,213,118,0.14)] text-[#BFF3D6] border border-[rgba(43,213,118,0.22)]",
          "failed": "bg-[rgba(255,77,77,0.14)] text-[#FFC2C2] border border-[rgba(255,77,77,0.22)]"
        }
      }
    },

    "navigation": {
      "public_header": {
        "layout": "left brand badge + nav links, right CTA",
        "component": "navigation-menu",
        "brand_badge": "Yellow V badge (square 36px, rounded-lg) + VINCHECK wordmark",
        "data_testid": "public-header"
      },
      "admin_nav": {
        "desktop": "Sidebar (w-64) with icons + active gold indicator",
        "mobile": "Sheet drawer triggered by icon button",
        "components": ["sheet", "button", "separator"],
        "data_testid": "admin-sidebar"
      },
      "breadcrumbs": {
        "component": "breadcrumb",
        "usage": "Admin detail pages"
      }
    },

    "modals_and_feedback": {
      "confirmations": {
        "component": "alert-dialog",
        "usage": "Delete order, resend result",
        "data_testid": "confirm-dialog"
      },
      "toasts": {
        "library": "sonner",
        "component": "sonner",
        "rules": "Success: qızılı accent yox, yaşıl; Payment mocked: info toast",
        "data_testid": "toast-region"
      },
      "loading": {
        "component": "skeleton",
        "usage": "Order tracking result, admin tables"
      }
    }
  },

  "page_blueprints": {
    "homepage": {
      "hero": {
        "layout": "Split-screen (desktop): left copy + form teaser, right image card. Mobile: stacked.",
        "headline": "AVTOVIN YOXLAMA",
        "sub": "VIN kodunu daxil edin, 15 AZN ödəniş edin və hesabatı əldə edin.",
        "primary_cta": "VIN yoxla",
        "secondary_cta": "Sifarişi izləmək",
        "hero_background": "grid + mild radial gold/blue overlay (<=20% viewport)",
        "trust_row": ["Təhlükəsiz ödəniş", "Sürətli cavab", "Şəffaf proses"],
        "data_testid": {
          "hero": "home-hero",
          "cta_primary": "home-hero-primary-cta",
          "cta_secondary": "home-hero-secondary-cta"
        }
      },
      "how_it_works": {
        "layout": "3-step cards with numbered badges",
        "steps": [
          "VIN kodunu daxil edin",
          "15 AZN ödəniş edin",
          "Hesabatı əldə edin"
        ],
        "micro": "Step card hover: border gold intensifies + slight lift"
      },
      "proof": {
        "content": "FAQ + təhlükəsizlik qeyd (məlumatların qorunması) + nümunə hesabat preview (blurred)",
        "components": ["accordion", "card", "badge"]
      }
    },

    "order_form": {
      "layout": "Desktop 2-col: left form, right sticky summary card (price 15 AZN + what you get).",
      "summary_card": ["Qiymət: 15 AZN", "Çatdırılma: Email/Telegram", "Orta müddət: 10-30 dəq"],
      "data_testid": {
        "page": "order-form-page",
        "summary": "order-form-summary-card"
      }
    },

    "payment": {
      "layout": "Centered narrow panel (NOT whole app centered; only content max-w-md) + order summary",
      "paypal_mock": {
        "button_text": "PayPal ilə ödə (mock)",
        "note": "Ödəniş simulyasiyadır",
        "data_testid": "payment-paypal-mock-button"
      }
    },

    "order_confirmation": {
      "layout": "Success card + tracking code (mono) + copy button",
      "components": ["card", "button", "badge", "tooltip"],
      "data_testid": {
        "tracking": "order-confirmation-tracking-code",
        "copy": "order-confirmation-copy-tracking-button"
      }
    },

    "order_tracking": {
      "layout": "Input tracking code + results panel",
      "states": ["empty", "loading", "not_found", "found_pending", "found_completed"],
      "data_testid": {
        "input": "order-tracking-code-input",
        "submit": "order-tracking-submit-button",
        "result": "order-tracking-result-panel"
      }
    },

    "admin": {
      "login": {
        "layout": "Two-panel: left brand + security copy, right login card",
        "data_testid": {
          "email": "admin-login-email-input",
          "password": "admin-login-password-input",
          "submit": "admin-login-submit-button"
        }
      },
      "dashboard": {
        "kpis": ["Yeni sifarişlər", "Ödənilmiş", "Tamamlanmış", "Gəlir (AZN)"],
        "charts": {
          "library": "recharts",
          "usage": "Orders over time (area/line) + status breakdown (bar)",
          "install": "npm i recharts",
          "style": "Dark gridlines + gold highlight line"
        },
        "data_testid": {
          "kpi_row": "admin-dashboard-kpi-row",
          "orders_table": "admin-dashboard-orders-table"
        }
      },
      "order_detail": {
        "layout": "Top summary + tabs (Details / Payment / Result)",
        "result_entry": "Textarea + file upload placeholder (future) + Send button",
        "data_testid": {
          "result_textarea": "admin-order-result-textarea",
          "send": "admin-order-send-result-button"
        }
      },
      "settings": {
        "layout": "Cards: Price (15 AZN), Texts, Design toggles (grid on/off, accent intensity)",
        "components": ["tabs", "card", "input", "switch", "select"],
        "data_testid": {
          "price": "admin-settings-price-input",
          "save": "admin-settings-save-button"
        }
      }
    }
  },

  "motion_and_microinteractions": {
    "library": {
      "name": "framer-motion",
      "install": "npm i framer-motion",
      "usage": "Hero entrance, card hover lift, table row highlight, stepper transitions"
    },
    "principles": [
      "Duration: 160–220ms for hover, 240–320ms for page/section entrance",
      "Easing: cubic-bezier(0.2, 0.8, 0.2, 1)",
      "Hover: translateY(-2px) + shadow lift (NOT transform transitions globally)",
      "Reduced motion: prefers-reduced-motion üçün motion disable"
    ],
    "examples": {
      "card_hover": "transition-shadow duration-200 hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
      "cta_hover": "hover:shadow-[0_0_0_1px_rgba(245,200,75,0.22),0_18px_60px_rgba(0,0,0,0.55)] active:scale-[0.98]"
    }
  },

  "accessibility": {
    "contrast": "Gold accent yalnız vurğu üçün; body text həmişə #F2F2F2 / #C9CBD1. Border-lar minimum 1px və kifayət qədər kontrast.",
    "focus": "focus-visible:ring-2 ring gold + ring-offset-background",
    "keyboard": "Admin table actions dropdown-menu keyboard accessible",
    "aria": "Dialog/Sheet/AlertDialog shadcn default ARIA saxlanılsın",
    "forms": "Label hər input-a bağlı (htmlFor). Error message input ilə əlaqələndirilsin (aria-describedby)."
  },

  "image_urls": {
    "hero": [
      {
        "url": "https://images.pexels.com/photos/10924197/pexels-photo-10924197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Hero sağ panel üçün: gecə avtomobil paneli — premium, texniki hiss",
        "placement": "Homepage hero right card background (overlay + dark scrim)"
      },
      {
        "url": "https://images.pexels.com/photos/9530906/pexels-photo-9530906.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Alternativ hero vizualı: sükan + panel",
        "placement": "Homepage hero / Order form side panel"
      }
    ],
    "process_or_trust": [
      {
        "url": "https://images.unsplash.com/photo-1550726570-5d88e3969025?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "İnspeksiya/diagnostika hissi — 'Necə işləyir' və ya trust section",
        "placement": "Homepage proof section (small image card)"
      }
    ]
  },

  "instructions_to_main_agent": [
    "App.css-dəki .App-header mərkəzləmə (align-items/justify-content center) landing üçün uyğun deyil — onu istifadə etməyin; layout-u Tailwind container ilə qurun.",
    "index.css-də :root tokenlərini dark palitraya uyğun yeniləyin; dark-only olduğuna görə .dark toggle-a ehtiyac yoxdur.",
    "Bütün interaktiv elementlərə data-testid əlavə edin (button, input, link, tab trigger, table action). Kebab-case istifadə edin.",
    "PayPal ödənişi MOCKED-dir: UI-də bunu açıq qeyd edin (badge + info toast).",
    "Telegram/Email bildirişləri hazırdır amma aktiv deyil: UI-də 'Tezliklə' badge və tooltip ilə göstər.",
    "Admin dashboard üçün Recharts əlavə edin (orders trend + status breakdown).",
    "Motion üçün framer-motion istifadə edin; prefers-reduced-motion dəstəyi əlavə edin.",
    "VIN və tracking code sahələrində mono font + copy-to-clipboard affordance verin.",
    "Gradient qaydalarına ciddi əməl edin: yalnız hero background overlay, max 20% viewport."
  ]
}

---

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
