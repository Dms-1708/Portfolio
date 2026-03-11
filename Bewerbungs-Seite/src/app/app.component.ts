import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  navOpen = false;
  formSent = false;
  typingText = '';
  private typingTexts = ['Informatiker im 1. Lehrjahr', 'Motiviert zu lernen', '17 Jahre alt'];
  private i = 0;
  private j = 0;
  private isDeleting = false;

  language: 'de' | 'en' | 'it' = 'de';
  texts: any = {};
  safekey: string = 'm';
  constructor(private renderer: Renderer2, private http: HttpClient) {}
  showScrollTop = false;
  isLoading = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    const storedMode = localStorage.getItem('darkmode');
    const storedLang = localStorage.getItem('lang');
    const storedCount = localStorage.getItem('count')
    this.count = storedCount !== null ? parseInt(storedCount, 10) : 0;
    (window as any).resetCount = () => {
      this.count = 0;
      localStorage.setItem('count', '0');
      console.log('Zähler zurückgesetzt');
    };
    window.addEventListener('scroll', () => {
      this.showScrollTop = window.scrollY > 300;
    });

    // Fade-in animation on scroll using IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }, 100);
    
    if (storedMode === null) {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem('darkmode', this.isDarkMode.toString());
    } else {
      this.isDarkMode = storedMode === 'true';
    }

    if (storedLang) {
      this.language = storedLang as 'de' | 'en' | 'it';
    }


    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark');
    }
    

    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.key.toLowerCase() === this.safekey && this.count < 2) {
        this.showAdminLogin = true;
        this.logs.push(`[${new Date().toLocaleTimeString()}] 🕵️ Admin-Modus aktiviert`);
      }
    });

    this.type();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkmode', this.isDarkMode.toString());

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }

  toggleNav(): void {
    this.navOpen = !this.navOpen;
  }
  emailout: boolean = false;
  successMessage: string = '';

  onSubmit(form: NgForm): void {
    this.isLoading = true;
  
    if (!form.valid) {
      this.isLoading = false;
      return;
    }
  
    emailjs.send(
      'service_tveug9i',
      'template_4wz7a2',
      {
        from_name: form.value.name,
        reply_to: form.value.email,
        message: form.value.message
      },
      'wDNh4KVcfiHJdnVps'
    ).then(() => {
      return emailjs.send(
        'service_tveug9i',
        'template_drittea',
        {
          from_name: form.value.name,
          reply_to: form.value.email,
          message: form.value.message
        },
        'wDNh4KVcfiHJdnVps'
      );
    }).then(() => {
      this.isLoading = false;
      this.successMessage = '✅ Nachricht erfolgreich gesendet!';
      setTimeout(() => {
        this.successMessage = '';
      }, 4000);
      form.resetForm();
    }).catch(error => {
      this.isLoading = false;
      this.successMessage = '❌ Fehler beim Senden';
      console.error(error);
      setTimeout(() => {
        this.successMessage = '';
      }, 4000);
    });
  }
  

  private type(): void {
    const text = this.typingTexts[this.i];
    this.typingText = text.substring(0, this.j);

    if (!this.isDeleting && this.j < text.length) {
      this.j++;
      setTimeout(() => this.type(), 100);
    } else if (this.isDeleting && this.j > 0) {
      this.j--;
      setTimeout(() => this.type(), 50);
    } else {
      this.isDeleting = !this.isDeleting;
      if (!this.isDeleting) this.i = (this.i + 1) % this.typingTexts.length;
      setTimeout(() => this.type(), 1000);
    }
  }

  adminCode = '';
  adminAccess = false;
  logs: string[] = [];
  adminCommand: string = '';
  showAdminLogin = false;
  count: number = 0;

  checkAdmin(): void {
    if (this.adminCode === 'dominic') {
      this.adminAccess = true;
      this.logs.push(`[${new Date().toLocaleTimeString()}] Zugang erlaubt`);
      if (this.count <= 0) {
        console.log("töifer geits nüm")
      } else {
      this.count = 0;
      localStorage.setItem('count', this.count.toString())
      }
    } else {
      this.adminAccess = false;
      this.logs.push(`[${new Date().toLocaleTimeString()}] Zugang verweigert`);
      this.showAdminLogin = false;
      this.safekey = 'c';
      this.count++;
      localStorage.setItem('count', this.count.toString());
      console.log(this.count)
      
    }
  }

  logDebug(): void {
    this.logs.push(`[${new Date().toLocaleTimeString()}] Debugging gestartet`);
    this.logs.push(`→ Sprache: ${this.language}`);
    this.logs.push(`→ Darkmode: ${this.isDarkMode}`);
    this.logs.push(`→ ScrollY: ${window.scrollY}`);
  }

  clearLogs(): void {
    this.logs = [`[${new Date().toLocaleTimeString()}] Konsole geleert`];
  }

  handleCommand(): void {
    const cmd = this.adminCommand.trim().toLowerCase();
    const time = new Date().toLocaleTimeString();

    const loadAndLog = (file: string, label: string) => {
      this.http.get(`assets/${file}`, { responseType: 'text' }).subscribe(code => {
        this.logs.push(`[${time}] Zeige ${label}:`);
        this.logs.push(...code.split('\n'));
      }, () => {
        this.logs.push(`[${time}] ❌ Fehler beim Laden von ${file}`);
      });
    };

    switch (cmd) {
      case 'clear':
        this.logs = [`[${time}] Konsole geleert.`];
        break;
      case 'status':
        this.logs.push(`[${time}] Sprache: ${this.language}`);
        this.logs.push(`[${time}] Darkmode: ${this.isDarkMode}`);
        break;
      case 'show html':
        loadAndLog('code-html.txt', 'HTML');
        break;
      case 'show css':
        loadAndLog('code-css.txt', 'CSS');
        break;
      case 'show ts':
        loadAndLog('code-ts.txt', 'TypeScript');
        break;
      default:
        this.logs.push(`[${time}] ❌ Unbekannter Befehl: ${cmd}`);
        break;
    }

    this.adminCommand = '';
  }


}
