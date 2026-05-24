import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page fade-in">
      <!-- Cabeçalho Principal -->
      <div class="page-header" style="align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, var(--purple), #7C3AED); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 24px rgba(79,70,229,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
          </div>
          <div>
            <h1 class="page-title" style="margin:0;font-size:32px;letter-spacing:-1px;">Central de Ajuda & Suporte</h1>
            <p class="page-subtitle" style="font-size:15px;margin:0">Guias completos, diagnósticos de problemas e canais de contato com a DevFlow</p>
          </div>
        </div>
      </div>

      <!-- Hero com Busca Inteligente -->
      <div class="card card-premium glow-indigo" style="margin-bottom: 32px; padding: 40px; text-align: center; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.08) 0%, transparent 60%), rgba(255, 255, 255, 0.02) !important; border: 1px solid rgba(139, 92, 246, 0.25) !important;">
        <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 12px; color: #fff; font-family: var(--font_display);">Como podemos ajudar você hoje?</h2>
        <p style="font-size: 15px; color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
          Digite palavras-chave como "Budget Guard", "Timesheet", "DRE" ou "Custos" para filtrar guias, FAQs e soluções específicas instantaneamente.
        </p>
        <div style="position: relative; max-width: 500px; margin: 0 auto;">
          <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); display: flex;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input 
            class="input" 
            type="text" 
            placeholder="Pesquise por termos, ferramentas ou problemas..." 
            style="padding: 12px 16px 12px 48px; border-radius: 30px; font-size: 14.5px; background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.12); box-shadow: 0 4px 20px rgba(0,0,0,0.4);" 
            [(ngModel)]="searchQuery" 
          />
          @if (searchQuery()) {
            <button 
              (click)="clearSearch()" 
              style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; font-size: 14px;"
            >
              ✕
            </button>
          }
        </div>
      </div>

      <!-- Abas de Filtros Rápidos -->
      <div style="display: flex; gap: 8px; margin-bottom: 32px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none;">
        @for (tab of tabs; track tab.id) {
          <button 
            class="btn" 
            [class.btn-primary]="selectedTab() === tab.id" 
            [class.btn-ghost]="selectedTab() !== tab.id"
            style="padding: 8px 18px; font-size: 13px;"
            (click)="selectTab(tab.id)"
          >
            <span style="display: flex; align-items: center; gap: 6px;">
              @if (tab.id === 'tudo') { <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
              @if (tab.id === 'primeiros-passos') { <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> }
              @if (tab.id === 'timesheet') { <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
              @if (tab.id === 'budget') { <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
              @if (tab.id === 'financeiro') { <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
              {{ tab.label }}
            </span>
          </button>
        }
      </div>

      <!-- Guias de Utilização -->
      @if (filteredGuias().length > 0) {
        <div style="margin-bottom: 48px;">
          <h3 style="font-family: var(--font_display); font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
            <span style="width: 6px; height: 18px; background: var(--purple); border-radius: 4px; display: inline-block;"></span>
            Guias Passo a Passo
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
            @for (guia of filteredGuias(); track guia.title) {
              <div class="card card-premium" style="display: flex; flex-direction: column; justify-content: space-between; padding: 24px;">
                <div>
                  <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(99,102,241,0.12); display: flex; align-items: center; justify-content: center; color: var(--purple-light); flex-shrink: 0;">
                      @if (guia.icon === 'rocket') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> }
                      @if (guia.icon === 'clock') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
                      @if (guia.icon === 'shield') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
                      @if (guia.icon === 'bar-chart') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
                    </div>
                    <div>
                      <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">{{ guia.title }}</h4>
                      <p style="font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.4;">{{ guia.summary }}</p>
                    </div>
                  </div>
                  <div style="border-top: 1px solid var(--border); padding-top: 14px; margin-top: 8px;">
                    <ul style="padding-left: 16px; margin: 0; color: var(--text-secondary); font-size: 13px; display: flex; flex-direction: column; gap: 8px; line-height: 1.4;">
                      @for (step of guia.steps; track step) {
                        <li>{{ step }}</li>
                      }
                    </ul>
                  </div>
                </div>
                <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                  <span class="chip-premium purple" style="font-size: 9px; padding: 2px 8px; border: 1px solid rgba(139,92,246,0.2);">{{ guia.category }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Resolução de Problemas (Troubleshooting) -->
      @if (filteredTroubleshoots().length > 0) {
        <div style="margin-bottom: 48px;">
          <h3 style="font-family: var(--font_display); font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
            <span style="width: 6px; height: 18px; background: #EF4444; border-radius: 4px; display: inline-block;"></span>
            Resolução de Impedimentos & Erros
          </h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            @for (item of filteredTroubleshoots(); track item.title) {
              <div class="card card-premium" style="border: 1px solid rgba(239, 68, 68, 0.15) !important; border-top: 1px solid rgba(239, 68, 68, 0.25) !important; background: rgba(239, 68, 68, 0.01) !important; padding: 20px;">
                <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; md:flex-nowrap;">
                  <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(239, 68, 68, 0.12); display: flex; align-items: center; justify-content: center; color: #EF4444; flex-shrink: 0;">
                    @if (item.icon === 'shield-alert') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }
                    @if (item.icon === 'cloud-lightning') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58"/><polyline points="13 11 9 17 12 17 11 23"/></svg> }
                    @if (item.icon === 'lock') { <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
                  </div>
                  <div style="flex: 1; min-width: 260px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 6px;">
                      <h4 style="font-size: 15px; font-weight: 700; color: #fff; margin: 0;">{{ item.title }}</h4>
                      <span class="chip error" style="font-size: 9px; padding: 2px 6px;">{{ item.category }}</span>
                    </div>
                    <p style="font-size: 13px; color: var(--text-secondary); margin: 0 0 12px 0; line-height: 1.4;">
                      <strong style="color: var(--text-primary)">Sintoma:</strong> {{ item.description }}
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 12px; font-size: 13px; line-height: 1.4;">
                      <div>
                        <strong style="color: #FCA5A5; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">⚠️ Causa Provável</strong>
                        <div style="color: var(--text-secondary);">{{ item.cause }}</div>
                      </div>
                      <div>
                        <strong style="color: #A7F3D0; display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">✅ Resolução</strong>
                        <div style="color: var(--text-secondary);">{{ item.solution }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- FAQ Dinâmico -->
      @if (filteredFaq().length > 0) {
        <div style="margin-bottom: 48px;">
          <h3 style="font-family: var(--font_display); font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
            <span style="width: 6px; height: 18px; background: #10B981; border-radius: 4px; display: inline-block;"></span>
            Dúvidas Frequentes (FAQ)
          </h3>
          <div class="card card-premium" style="padding: 8px 24px; display: flex; flex-direction: column;">
            @for (f of filteredFaq(); track f.q; let isLast = $last) {
              <div style="padding: 16px 0; cursor: pointer; transition: background 0.2s;" (click)="toggleFaq(f)" [style.border-bottom]="isLast ? 'none' : '1px solid var(--border)'">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                  <h4 style="font-size: 14px; font-weight: 600; color: #fff; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--purple-light); display: inline-block; flex-shrink:0;"></span>
                    {{ f.q }}
                  </h4>
                  <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                    <span class="chip-premium purple" style="font-size: 8px; padding: 1px 6px;">{{ f.category }}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" [style.transform]="f.open ? 'rotate(180deg)' : 'none'" style="transition: transform 0.2s; color: var(--text-muted);">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                @if (f.open) {
                  <div style="margin-top: 10px; font-size: 13px; color: var(--text-secondary); line-height: 1.5; border-left: 2px solid var(--purple); padding-left: 10px; animation: slideDown 0.2s ease forwards;">
                    {{ f.a }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Estado Vazio para Busca -->
      @if (filteredGuias().length === 0 && filteredTroubleshoots().length === 0 && filteredFaq().length === 0) {
        <div class="card card-premium" style="text-align: center; padding: 48px 24px; margin-bottom: 48px; border: 1px solid rgba(239, 68, 68, 0.2) !important;">
          <div style="font-size: 36px; margin-bottom: 12px;">🔍</div>
          <h3 style="color: #fff; font-size: 16px; margin-bottom: 6px;">Nenhum resultado encontrado</h3>
          <p style="color: var(--text-muted); font-size: 13.5px; max-width: 460px; margin: 0 auto 16px;">
            Não encontramos nenhum guia ou pergunta correspondente a "{{ searchQuery() }}". Tente buscar por termos mais genéricos ou clique no botão abaixo para limpar.
          </p>
          <button class="btn btn-primary" style="padding: 8px 20px; font-size: 13px;" (click)="clearSearch()">Limpar Pesquisa</button>
        </div>
      }

      <!-- Canais de Contato e Formulário -->
      <div style="margin-top: 48px;">
        <h3 style="font-family: var(--font_display); font-size: 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 10px;">
          <span style="width: 6px; height: 18px; background: linear-gradient(180deg, var(--purple), #7C3AED); border-radius: 4px; display: inline-block;"></span>
          Ainda Precisa de Ajuda? Fale com a DevFlow
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          <!-- Canais Diretos -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="card card-premium" style="padding: 20px; background: linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%) !important;">
              <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--purple-light);"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Suporte de Engenharia
              </h4>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.4;">
                Nossa equipe de suporte técnico e engenharia responde diretamente a dúvidas operacionais e técnicas de segunda a sexta, das 9h às 18h.
              </p>
              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--text-muted); width: 70px; font-weight: 600;">E-mail:</span>
                  <a href="mailto:suporte@devflow.solutions" style="color: var(--purple-light); text-decoration: none; font-weight: 500;">suporte&#64;devflow.solutions</a>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--text-muted); width: 70px; font-weight: 600;">Telefone:</span>
                  <span style="color: #fff;">+55 (11) 4003-3569</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--text-muted); width: 70px; font-weight: 600;">WhatsApp:</span>
                  <a href="https://wa.me/551140033569" target="_blank" style="color: #10B981; text-decoration: none; font-weight: 600;">(11) 99988-7766</a>
                </div>
              </div>
            </div>

            <div class="card card-premium" style="padding: 20px;">
              <h4 style="color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--purple-light);"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Prazos de Retorno (SLA)
              </h4>
              <ul style="padding-left: 16px; margin: 0; color: var(--text-secondary); font-size: 12.5px; display: flex; flex-direction: column; gap: 8px; line-height: 1.4;">
                <li><strong>Falhas Críticas no Sistema:</strong> Até 2 horas úteis.</li>
                <li><strong>Impedimento no Timesheet/Projetos:</strong> Até 4 horas úteis.</li>
                <li><strong>Dúvidas gerais e novas permissões:</strong> Até 1 dia útil.</li>
              </ul>
            </div>
          </div>

          <!-- Formulário Interativo -->
          <div class="card card-premium glow-indigo" style="padding: 24px; border: 1px solid rgba(139, 92, 246, 0.2) !important;">
            <h4 style="color: #fff; font-size: 16px; font-weight: 700; margin-bottom: 14px;">Abrir Chamado de Suporte</h4>
            
            <form (submit)="sendSupportMessage($event)" style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <label class="label" style="font-size: 11px;">Seu Nome *</label>
                  <input class="input" type="text" [(ngModel)]="contactForm.name" name="name" required placeholder="Digite seu nome" style="padding: 8px 10px; font-size: 13.5px;" />
                </div>
                <div>
                  <label class="label" style="font-size: 11px;">E-mail *</label>
                  <input class="input" type="email" [(ngModel)]="contactForm.email" name="email" required placeholder="Digite seu e-mail" style="padding: 8px 10px; font-size: 13.5px;" />
                </div>
              </div>
              
              <div>
                <label class="label" style="font-size: 11px;">Assunto do Chamado *</label>
                <select class="select" [(ngModel)]="contactForm.subject" name="subject" required style="padding: 8px 10px; font-size: 13.5px;">
                  <option value="" disabled selected>Selecione um tópico...</option>
                  <option value="duvida">Dúvida Operacional</option>
                  <option value="bug">Relatar Erro/Bug no App</option>
                  <option value="budget">Dúvida sobre o Budget Guard</option>
                  <option value="sugestao">Sugestão de Melhoria</option>
                  <option value="outro">Outro Assunto</option>
                </select>
              </div>
              
              <div>
                <label class="label" style="font-size: 11px;">Mensagem Detalhada *</label>
                <textarea class="textarea" rows="3" [(ngModel)]="contactForm.message" name="message" required placeholder="Descreva em detalhes o que você precisa ou as etapas do erro..." style="padding: 8px 10px; font-size: 13.5px; min-height: 70px;"></textarea>
              </div>
              
              <button class="btn btn-primary" type="submit" [disabled]="submittingForm || !contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message" style="margin-top: 6px; width: 100%; height: 38px; font-size: 13.5px; padding: 0 16px;">
                @if (submittingForm) {
                  <span style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                    <span class="spinner"></span>
                    Enviando chamado...
                  </span>
                } @else {
                  <span style="display: flex; align-items: center; gap: 6px; justify-content: center;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Enviar Solicitação
                  </span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(0, 0, 0, 0.2);
      border-top-color: #fff;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.8s infinite linear;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in {
      animation: fadeIn 0.4s ease forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AjudaComponent {
  private toast = inject(ToastService);

  searchQuery = signal('');
  selectedTab = signal('tudo');
  submittingForm = false;

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  tabs = [
    { id: 'tudo', label: 'Tudo' },
    { id: 'primeiros-passos', label: 'Primeiros Passos' },
    { id: 'timesheet', label: 'Timesheet' },
    { id: 'budget', label: 'Budget Guard' },
    { id: 'financeiro', label: 'DRE & Financeiro' }
  ];

  guias = signal([
    {
      title: 'Primeiros Passos no DevFlow',
      summary: 'Aprenda os conceitos básicos da plataforma e como configurar seu workspace inicial.',
      steps: [
        'Cadastre seus clientes na aba "Clientes".',
        'Crie os seus projetos associando-os a estes clientes.',
        'Defina as Sprints do projeto para que a equipe possa organizar as entregas.',
        'Convide seu squad configurando o perfil e taxa horária em "Desenvolvedores".'
      ],
      icon: 'rocket',
      category: 'primeiros-passos'
    },
    {
      title: 'Dominando o Timesheet',
      summary: 'Dicas para um registro preciso de horas produtivas e extras.',
      steps: [
        'Lance as horas no mesmo dia da atividade para manter os dashboards atualizados.',
        'Sempre descreva o que foi feito na tarefa para auditorias futuras e relatórios transparentes.',
        'Selecione a sprint correta para garantir a correlação de custos da fase.',
        'Separe horas normais de extras de acordo com as regras de jornada de sua empresa.'
      ],
      icon: 'clock',
      category: 'timesheet'
    },
    {
      title: 'Configurando o Budget Guard Patroll',
      summary: 'Como blindar seus projetos contra estouros de custos.',
      steps: [
        'No menu "Projetos", edite o projeto desejado.',
        'Defina o Orçamento Total planejado para a entrega.',
        'Ative a chave "Budget Guard Active" para ativar o bloqueio automatizado.',
        'Acompanhe o Burn Rate no Financeiro para monitorar a velocidade de queima do caixa.'
      ],
      icon: 'shield',
      category: 'budget'
    },
    {
      title: 'DRE & Análise Financeira',
      summary: 'Aprenda a analisar as margens e exportar relatórios prontos para investidores e sócios.',
      steps: [
        'Acesse "Financeiro" para visualizar o faturamento consolidado.',
        'Veja a receita líquida e deduza os custos de devs, clouds, APIs e despesas operacionais.',
        'Examine o gráfico de burn rate por projeto para identificar desvios de escopo.',
        'Clique em "Exportar DRE" para baixar o PDF completo com gráficos e resumos.'
      ],
      icon: 'bar-chart',
      category: 'financeiro'
    }
  ]);

  troubleshoots = signal([
    {
      title: 'Erro: "Lançamento bloqueado pelo Budget Guard"',
      description: 'Você tenta registrar horas no Timesheet e recebe um erro informando que o orçamento foi excedido.',
      cause: 'O orçamento do projeto atingiu o limite máximo de custos permitidos em relação ao total acumulado por horas dos devs e custos adicionais.',
      solution: 'Solicite ao Gestor do projeto que faça uma destas ações: 1. Aumente o orçamento limite nas configurações do projeto; 2. Aprove uma Change Request (CR) ativa para expandir o caixa; 3. Desative temporariamente a trava de segurança caso seja uma exceção acordada.',
      icon: 'shield-alert',
      category: 'budget'
    },
    {
      title: 'Custos de Nuvem/API não aparecem no Dashboard',
      description: 'Você cadastrou despesas no menu Custos Cloud ou Custos API, mas a saúde do projeto continua sem refletir esses valores.',
      cause: 'O mês de competência selecionado no lançamento do custo de nuvem/API é diferente do período visualizado no filtro do Dashboard, ou o projeto selecionado não corresponde ao exibido.',
      solution: '1. Verifique se o mês e o ano de competência inseridos no formulário de custos coincidem com o período filtrado na tela de Dashboard/Financeiro; 2. Garanta que a vinculação do projeto foi feita com a entidade correta.',
      icon: 'cloud-lightning',
      category: 'financeiro'
    },
    {
      title: 'Não consigo ver a aba "Financeiro" ou "Desenvolvedores"',
      description: 'Determinados menus não aparecem na sua barra lateral esquerda ou exibe mensagem de acesso negado.',
      cause: 'O seu perfil de usuário está definido como "Desenvolvedor" ou "Cliente", que possuem visibilidade restrita a lançamentos e tarefas pessoais.',
      solution: 'Entre em contato com um administrador de nível "Gestor" da sua empresa e peça a alteração de seu perfil/role em "Usuários" caso você precise gerenciar orçamentos, taxas financeiras de squads e DREs.',
      icon: 'lock',
      category: 'primeiros-passos'
    }
  ]);

  faq = signal([
    { q: 'Como lançar um timesheet?', a: 'Acesse "Lançar Horas" (ou a aba Timesheet) na barra lateral, clique no botão "Registrar Horas" no topo, selecione o desenvolvedor, a sprint correspondente, informe a data, o número de horas trabalhadas e as horas extras se aplicável, descreva brevemente a tarefa e salve.', category: 'timesheet', open: false },
    { q: 'O que é o Budget Guard Patroll?', a: 'É o motor inteligente de proteção financeira do DevFlow. Ele analisa em tempo real os custos operacionais (valores/hora dos desenvolvedores ativos nos lançamentos) e operacionais indiretos do projeto. Caso o orçamento definido para o projeto seja totalmente consumido, ele bloqueia novos lançamentos de horas ou aciona alertas críticos para evitar prejuízos à sua agência.', category: 'budget', open: false },
    { q: 'Como gerar o relatório PDF da DRE?', a: 'Acesse a tela de Dashboard ou Financeiro. No topo da tela, clique no botão "Exportar DRE" ou "Exportar Relatório". A plataforma irá consolidar as margens de lucro, burn rate, histórico de despesas e gerar um relatório profissional em PDF pronto para compartilhamento.', category: 'financeiro', open: false },
    { q: 'Como cadastrar um custo de nuvem?', a: 'Vá até o menu "Custos Cloud" na barra lateral, clique no botão "+ Novo Custo", selecione o projeto em que a infraestrutura está alocada, selecione o provedor (AWS, Azure ou GCP), informe o valor em reais, o mês de competência e salve. Esses valores serão imputados na saúde financeira geral do projeto no dashboard.', category: 'financeiro', open: false },
    { q: 'Como cadastrar os custos de API?', a: 'Da mesma forma que custos de nuvem, clique no menu "Custos API", depois em "+ Novo Custo", e defina o projeto correspondente, o provedor de API (OpenAI, DeepSeek, Google Maps, Twilio, etc.), o valor faturado, o mês de competência e salve. Isso permite calcular a margem de contribuição exata de produtos de software intensivos em IA.', category: 'financeiro', open: false },
    { q: 'Como convidar desenvolvedores para a minha equipe?', a: 'Se você possui cargo de Gestor, vá em "Usuários", clique em "+ Novo Usuário", insira o nome, email, senha inicial e selecione a role "DESENVOLVEDOR". Após isso, navegue até a aba "Desenvolvedores" para configurar o valor/hora específico deste profissional para que os cálculos de timesheet funcionem corretamente.', category: 'primeiros-passos', open: false },
    { q: 'O que é uma Change Request (CR)?', a: 'Uma Change Request (CR) representa uma solicitação de alteração ou acréscimo de escopo em um projeto ativo. Caso o cliente solicite novas demandas que não estavam previstas no orçamento inicial, você pode registrar uma CR para adicionar orçamento extra ao projeto de forma documentada, evitando estourar o Budget Guard original.', category: 'budget', open: false }
  ]);

  filteredGuias = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tab = this.selectedTab();
    
    return this.guias().filter(g => {
      if (tab !== 'tudo' && g.category !== tab) return false;
      if (q) {
        return g.title.toLowerCase().includes(q) || 
               g.summary.toLowerCase().includes(q) || 
               g.steps.some(s => s.toLowerCase().includes(q));
      }
      return true;
    });
  });

  filteredTroubleshoots = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tab = this.selectedTab();
    
    return this.troubleshoots().filter(t => {
      if (tab !== 'tudo' && t.category !== tab) return false;
      if (q) {
        return t.title.toLowerCase().includes(q) || 
               t.description.toLowerCase().includes(q) || 
               t.cause.toLowerCase().includes(q) || 
               t.solution.toLowerCase().includes(q);
      }
      return true;
    });
  });

  filteredFaq = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const tab = this.selectedTab();
    
    return this.faq().filter(f => {
      if (tab !== 'tudo' && f.category !== tab) return false;
      if (q) {
        return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      }
      return true;
    });
  });

  selectTab(tabId: string) {
    this.selectedTab.set(tabId);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  toggleFaq(f: any) {
    this.faq.update(list => list.map(item => {
      if (item.q === f.q) {
        return { ...item, open: !item.open };
      }
      return item;
    }));
  }

  sendSupportMessage(event: Event) {
    event.preventDefault();
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      this.toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.submittingForm = true;

    setTimeout(() => {
      this.submittingForm = false;
      this.toast.success('Chamado aberto com sucesso! A equipe DevFlow entrará em contato em breve.');
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }, 1500);
  }
}

