import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import {
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logoWhatsapp,
  refreshOutline,
  logOutOutline,
  sendOutline,
  chevronBackOutline,
  chevronForwardOutline,
  documentTextOutline,
  createOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
  informationCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import {
  WaNotifierService,
  WaMessageLog,
} from '../../core/services/wa-notifier.service';
import { SignalRService } from '../../core/services/signalr.service';
import { MessageTemplateService } from '../../core/services/message-template.service';
import type { MessageTemplateResponse } from '../../core/models/message-template.model';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TextareaFieldComponent } from '../../shared/components/textarea-field/textarea-field.component';
import { AuthButtonComponent } from '../../shared/components/auth-button/auth-button.component';

@Component({
  selector: 'app-whatsapp',
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    TextInputComponent,
    TextareaFieldComponent,
    AuthButtonComponent,
  ],
  styles: `
    :host {
      display: block;
    }
    .page-shell {
      padding: 20px;
      max-width: 820px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-header h1 {
      margin: 0;
      font-size: 34px;
      line-height: 1.1;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--app-text);
    }
    .page-header p {
      margin: 6px 0 0;
      color: var(--app-text-muted);
      font-size: 14px;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 24px;
      background: var(--app-surface-2);
      border-radius: 12px;
      padding: 4px;
    }
    .tab {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: var(--app-text-muted);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    .tab:hover {
      color: var(--app-text);
    }
    .tab.active {
      background: var(--app-surface-2);
      color: var(--app-text);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    /* Connection card */
    .wa-card {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 18px;
      padding: 40px 32px;
      text-align: center;
    }

    .wa-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 8px;
    }

    .wa-icon {
      font-size: 40px;
      color: #25d366;
      flex-shrink: 0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 700;
    }
    .status-badge.ready {
      background: rgba(52, 211, 153, 0.1);
      color: #4ade80;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }
    .status-badge.qr {
      background: rgba(250, 204, 21, 0.1);
      color: #facc15;
      border: 1px solid rgba(250, 204, 21, 0.3);
    }
    .status-badge.initializing,
    .status-badge.disconnected {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
      border: 1px solid rgba(156, 163, 175, 0.3);
    }
    .status-badge.error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-dot.ready {
      background: #4ade80;
      box-shadow: 0 0 6px rgba(52, 211, 153, 0.5);
    }
    .status-dot.qr {
      background: #facc15;
      box-shadow: 0 0 6px rgba(250, 204, 21, 0.5);
      animation: pulse-dot 1.5s ease-in-out infinite;
    }
    .status-dot.initializing {
      background: #9ca3af;
    }
    .status-dot.disconnected {
      background: #9ca3af;
    }
    .status-dot.error {
      background: #ef4444;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .qr-container {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: inline-block;
      margin: 16px 0;
    }
    .qr-container img {
      width: 256px;
      height: 256px;
      display: block;
    }
    .qr-hint {
      font-size: 13px;
      color: var(--app-text-muted);
      margin-top: 8px;
      line-height: 1.5;
    }

    .status-message {
      color: var(--app-text-muted);
      font-size: 14px;
      margin: 24px 0;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
      flex-wrap: wrap;
    }

    /* Logs section */
    .logs-section {
      margin-top: 0;
    }
    .logs-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .logs-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--app-text);
    }
    .logs-header .badge-total {
      font-size: 12px;
      padding: 2px 10px;
      border-radius: 100px;
      background: var(--app-surface-2);
      color: var(--app-text-muted);
    }

    .logs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .logs-table thead th {
      text-align: left;
      padding: 8px 10px;
      color: var(--app-text-muted);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--app-border);
    }
    .logs-table tbody td {
      padding: 10px;
      border-bottom: 1px solid var(--app-border);
      vertical-align: top;
      color: var(--app-text);
    }
    .logs-table tbody tr:hover {
      background: var(--app-surface-2);
    }

    .type-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .type-badge.test {
      background: rgba(59, 130, 246, 0.12);
      color: #60a5fa;
    }
    .type-badge.reminder {
      background: rgba(168, 85, 247, 0.12);
      color: #c084fc;
    }

    .status-icon {
      font-size: 16px;
    }
    .status-icon.success {
      color: #4ade80;
    }
    .status-icon.fail {
      color: #ef4444;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid var(--app-border);
      border-top-color: #60a5fa;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .msg-cell {
      max-width: 260px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logs-empty {
      text-align: center;
      padding: 32px 0;
      color: var(--app-text-muted);
      font-size: 13px;
    }

    .logs-card {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 18px;
      padding: 24px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .logs-card table {
      min-width: 100%;
      white-space: nowrap;
    }
    .logs-card table th,
    .logs-card table td {
      white-space: nowrap;
    }
    .logs-card table td:first-child,
    .logs-card table td:nth-child(2),
    .logs-card table td:nth-child(3) {
      white-space: normal;
      word-break: break-word;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 16px 0 0;
      font-size: 13px;
      color: var(--app-text-muted);
    }
    .page-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 8px;
      padding: 6px 14px;
      color: var(--app-text);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .page-btn:hover:not(:disabled) {
      background: var(--app-surface-2);
      opacity: 0.85;
    }
    .page-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .page-info {
      white-space: nowrap;
    }

    /* Template list */
    .template-section {
      margin-top: 0;
    }
    .template-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .template-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--app-text);
    }
    .template-search {
      flex: 1;
      min-width: 180px;
      max-width: 300px;
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid var(--app-border);
      background: var(--app-surface-2);
      color: var(--app-text);
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }
    .template-search:focus {
      border-color: var(--app-text-muted);
    }
    .template-search::placeholder {
      color: var(--app-text-muted);
    }

    .template-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .template-card {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 16px;
      padding: 16px 20px;
      transition: border-color 0.2s;
    }
    .template-card:hover {
      border-color: var(--app-text-muted);
      opacity: 0.9;
    }

    .template-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .template-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .template-card-title h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: var(--app-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .active-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(52, 211, 153, 0.12);
      color: #4ade80;
      border: 1px solid rgba(52, 211, 153, 0.25);
      white-space: nowrap;
    }

    .template-card-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--app-text-muted);
      cursor: pointer;
      transition: all 0.15s;
    }
    .icon-btn:hover {
      background: var(--app-surface-2);
      color: var(--app-text);
    }
    .icon-btn.activate:hover {
      background: rgba(52, 211, 153, 0.12);
      color: #4ade80;
    }
    .icon-btn.edit:hover {
      background: rgba(59, 130, 246, 0.12);
      color: #60a5fa;
    }
    .icon-btn.delete:hover {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
    }

    .template-card-body {
      margin-top: 8px;
    }

    .template-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .template-meta-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 12px;
      color: var(--app-text-muted);
    }
    .template-meta-item ion-icon {
      font-size: 14px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .template-preview {
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      overflow: hidden;
    }

    .template-empty {
      text-align: center;
      padding: 40px 20px;
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 18px;
    }
    .template-empty ion-icon {
      font-size: 36px;
      color: var(--app-text-muted);
      margin-bottom: 12px;
    }
    .template-empty p {
      margin: 0 0 4px;
      color: var(--app-text-muted);
      font-size: 13px;
    }
    .template-empty .sub {
      color: var(--app-text-muted);
      opacity: 0.6;
      font-size: 12px;
    }

    .template-loading {
      text-align: center;
      padding: 40px;
      color: var(--app-text-muted);
      font-size: 13px;
    }

    /* Template form */
    .template-form-section {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 18px;
      padding: 24px;
    }

    .template-form-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      background: var(--app-surface-2);
      color: var(--app-text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .back-btn:hover {
      background: var(--app-surface-2);
      color: var(--app-text);
      opacity: 0.85;
    }

    .template-form-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }

    .placeholder-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }

    .placeholder-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--app-text-muted);
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }

    .placeholder-badge {
      display: inline-block;
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 6px;
      padding: 3px 10px;
      font-size: 11px;
      font-family: monospace;
      color: var(--app-text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .placeholder-badge:hover {
      background: var(--app-surface-2);
      color: var(--app-text);
      opacity: 0.85;
    }

    .form-error {
      font-size: 12px;
      color: #ef4444;
      margin-bottom: 12px;
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }

    .form-cancel {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      padding: 0 20px;
      border: 2px solid var(--app-border);
      border-radius: 12px;
      background: transparent;
      color: var(--app-text-muted);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .form-cancel:hover {
      background: var(--app-surface-2);
      color: var(--app-text);
    }

    .template-list-card {
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 18px;
      padding: 24px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Spacing helpers */
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .text-sm { font-size: 13px; }
    .text-xs { font-size: 12px; }
    .opacity-60 { opacity: 0.6; }
  `,
  template: `
    <div class="page-shell">
      <div class="page-header">
        <h1>WhatsApp</h1>
        <p>Gestión de la conexión WhatsApp</p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          class="tab"
          [class.active]="segment() === 'conexion'"
          (click)="segment.set('conexion')"
        >
          Conexión
        </button>
        <button
          class="tab"
          [class.active]="segment() === 'historial'"
          (click)="segment.set('historial')"
        >
          Historial
        </button>
        <button
          class="tab"
          [class.active]="segment() === 'plantillas'"
          (click)="switchToPlantillas()"
        >
          Plantillas
        </button>
      </div>

      @if (segment() === 'conexion') {
        <!-- Conexión -->
        <div class="wa-card">
          <div class="wa-header">
            <ion-icon name="logo-whatsapp" class="wa-icon"></ion-icon>
            <div
              class="status-badge"
              [class.ready]="status() === 'ready'"
              [class.qr]="status() === 'qr'"
              [class.initializing]="status() === 'initializing'"
              [class.disconnected]="status() === 'disconnected'"
              [class.error]="status() === 'error'"
            >
              <span
                class="status-dot"
                [class.ready]="status() === 'ready'"
                [class.qr]="status() === 'qr'"
                [class.initializing]="status() === 'initializing'"
                [class.disconnected]="status() === 'disconnected'"
                [class.error]="status() === 'error'"
              ></span>
              {{ statusLabel() }}
            </div>
          </div>

          @if (status() === 'qr' && qrDataUrl(); as qr) {
            <div class="qr-container">
              <img [src]="qr" alt="Código QR de WhatsApp" />
            </div>
            <p class="qr-hint">
              Escanea este código con WhatsApp en tu teléfono.<br />
              Ve a <strong>Ajustes &gt; Dispositivos vinculados</strong> y
              escanea el código.
            </p>
          } @else {
            <p class="status-message">
              @if (status() === 'initializing') {
                Inicializando cliente de WhatsApp...
              } @else if (status() === 'ready') {
                Conectado y listo para enviar mensajes.
              } @else if (status() === 'disconnected') {
                Sesión cerrada. Presiona <strong>Reiniciar</strong> para
                reconectar.
              } @else if (status() === 'error') {
                Error de autenticación. Presiona <strong>Reiniciar</strong> para
                reconectar.
              }
            </p>
          }

          <div class="actions">
            <ion-button
              fill="outline"
              color="danger"
              (click)="logout()"
              [disabled]="status() !== 'ready' && status() !== 'qr'"
            >
              <ion-icon slot="start" name="log-out-outline"></ion-icon>
              Cerrar Sesión
            </ion-button>
            <ion-button
              fill="outline"
              color="success"
              (click)="openTestModal()"
              [disabled]="status() !== 'ready'"
            >
              <ion-icon slot="start" name="send-outline"></ion-icon>
              Probar Envío
            </ion-button>
            <ion-button
              fill="solid"
              color="primary"
              (click)="restart()"
              [disabled]="restarting()"
            >
              <ion-icon slot="start" name="refresh-outline"></ion-icon>
              Reiniciar
            </ion-button>
          </div>

          @if (lastChecked()) {
            <p
              class="text-xs opacity-60 mt-4"
              style="color: var(--app-text-muted)"
            >
              Última actualización: {{ lastChecked() | date: 'HH:mm:ss' }}
            </p>
          }
        </div>
      }

      @if (segment() === 'historial') {
        <!-- Historial -->
        <div class="logs-section">
          <div class="logs-header">
            <h2>Historial de mensajes</h2>
            @if (logsTotal(); as total) {
              <span class="badge-total">{{ total }} envíos</span>
            }
          </div>

          <div class="logs-card">
            @if (logs().length === 0) {
              <div class="logs-empty">No hay mensajes enviados todavía.</div>
            } @else {
              <table class="logs-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Teléfono</th>
                    <th>Mensaje</th>
                    <th>Tipo</th>
                    <th>Enviado por</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  @for (log of logs(); track log.id) {
                    <tr>
                      <td>{{ log.id }}</td>
                      <td>{{ log.phone }}</td>
                      <td>
                        <div class="msg-cell" [title]="log.message">
                          {{ log.message }}
                        </div>
                      </td>
                      <td>
                        <span
                          class="type-badge"
                          [class.test]="log.type === 'Test'"
                          [class.reminder]="log.type === 'Reminder'"
                        >
                          {{ log.type === 'Test' ? 'Prueba' : 'Recordatorio' }}
                        </span>
                      </td>
                      <td>{{ log.sentBy }}</td>
                      <td>
                        @if (log.status === 'Sending') {
                          <span class="spinner" title="Enviando..."></span>
                        } @else if (log.status === 'Sent' || !log.status) {
                          <span class="status-icon success">&#10003;</span>
                        } @else {
                          <span
                            class="status-icon fail"
                            [title]="log.errorMessage ?? ''"
                            >&#10007;</span
                          >
                        }
                      </td>
                      <td>{{ log.createdAt | date: 'dd/MM/yy HH:mm' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
              @if (totalPages() > 1) {
                <div class="pagination">
                  <button
                    class="page-btn"
                    [disabled]="currentPage() <= 1"
                    (click)="goToPage(currentPage() - 1)"
                  >
                    <ion-icon name="chevron-back-outline"></ion-icon>
                    Anterior
                  </button>
                  <span class="page-info"
                    >Pág {{ currentPage() }} de {{ totalPages() }} ·
                    {{ logsTotal() }} registros</span
                  >
                  <button
                    class="page-btn"
                    [disabled]="currentPage() >= totalPages()"
                    (click)="goToPage(currentPage() + 1)"
                  >
                    Siguiente
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                  </button>
                </div>
              }
            }
          </div>
        </div>
      }

      @if (segment() === 'plantillas') {
        <!-- Plantillas -->
        <div class="template-section">
          @if (showTemplateForm()) {
            <!-- Form -->
            <div class="template-form-section">
              <div class="template-form-header">
                <button class="back-btn" (click)="cancelTemplateForm()">
                  <ion-icon name="arrow-back-outline"></ion-icon>
                </button>
                <h3 class="template-form-title">
                  {{
                    editingTemplateId() ? 'Editar Plantilla' : 'Nueva Plantilla'
                  }}
                </h3>
              </div>

              <form [formGroup]="templateForm" (ngSubmit)="onTemplateSubmit()">
                <app-text-input
                  [control]="templateForm.get('key')!"
                  label="Clave"
                  icon="document-text-outline"
                  placeholder="Ej: mileage_alert_reminder"
                ></app-text-input>

                <app-text-input
                  [control]="templateForm.get('description')!"
                  label="Descripción"
                  icon="information-circle-outline"
                  placeholder="Breve descripción de la plantilla"
                ></app-text-input>

                <div class="mb-2">
                  <label class="placeholder-label"
                    >Placeholders disponibles</label
                  >
                  <div class="placeholder-grid">
                    @for (ph of placeholders; track ph.key) {
                      <span
                        class="placeholder-badge"
                        [title]="'Insertar ' + ph.key"
                        (click)="insertPlaceholder(ph.key)"
                      >
                        {{ ph.key }}
                      </span>
                    }
                  </div>
                </div>

                <app-textarea-field
                  [control]="templateForm.get('template')!"
                  label="Plantilla del mensaje"
                  icon="create-outline"
                  placeholder="Escribe el mensaje usando los placeholders disponibles..."
                  [rows]="6"
                ></app-textarea-field>

                @if (templateFormError()) {
                  <div class="form-error">{{ templateFormError() }}</div>
                }

                <div class="form-actions">
                  <app-auth-button
                    [label]="
                      editingTemplateId()
                        ? 'ACTUALIZAR PLANTILLA'
                        : 'CREAR PLANTILLA'
                    "
                    [disabled]="templateForm.invalid || templateSubmitting()"
                    [loading]="templateSubmitting()"
                  ></app-auth-button>
                  <button
                    type="button"
                    class="form-cancel"
                    (click)="cancelTemplateForm()"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          } @else {
            <!-- List -->
            <div class="template-header">
              <h2>Plantillas de mensajes</h2>
              <div class="flex items-center gap-2">
                <input
                  class="template-search"
                  placeholder="Buscar por clave o descripción..."
                  [ngModel]="templateSearch()"
                  (ngModelChange)="onTemplateSearch($event)"
                />
                <ion-button
                  fill="outline"
                  color="primary"
                  (click)="openNewTemplate()"
                  style="white-space: nowrap;"
                >
                  <ion-icon
                    slot="start"
                    name="document-text-outline"
                  ></ion-icon>
                  Nueva Plantilla
                </ion-button>
              </div>
            </div>

            <div class="template-list-card">
              @if (templateService.loading()) {
                <div class="template-loading">Cargando plantillas...</div>
              } @else if (templates().length === 0) {
                <div class="template-empty">
                  <ion-icon name="document-text-outline"></ion-icon>
                  <p>No hay plantillas personalizadas.</p>
                  <p class="sub">
                    Crea tu primera plantilla para personalizar los mensajes.
                  </p>
                </div>
              } @else {
                <div class="template-list">
                  @for (tpl of templates(); track tpl.id) {
                    <div class="template-card">
                      <div class="template-card-top">
                        <div class="template-card-title">
                          <h3>{{ tpl.key }}</h3>
                          @if (tpl.isActive) {
                            <span class="active-badge">
                              <ion-icon
                                name="checkmark-circle-outline"
                                style="font-size: 12px;"
                              ></ion-icon>
                              Activa
                            </span>
                          }
                        </div>
                        <div class="template-card-actions">
                          @if (!tpl.isActive) {
                            <button
                              class="icon-btn activate"
                              (click)="activateTemplate(tpl.id, tpl.key)"
                              title="Activar como template oficial"
                            >
                              <ion-icon
                                name="checkmark-circle-outline"
                                style="font-size: 16px;"
                              ></ion-icon>
                            </button>
                          }
                          <button
                            class="icon-btn edit"
                            (click)="editTemplate(tpl)"
                            title="Editar"
                          >
                            <ion-icon
                              name="create-outline"
                              style="font-size: 16px;"
                            ></ion-icon>
                          </button>
                          <button
                            class="icon-btn delete"
                            (click)="deleteTemplate(tpl.id, tpl.key)"
                            title="Eliminar"
                          >
                            <ion-icon
                              name="trash-outline"
                              style="font-size: 16px;"
                            ></ion-icon>
                          </button>
                        </div>
                      </div>
                      <div class="template-card-body">
                        <div class="template-meta">
                          @if (tpl.description) {
                            <div class="template-meta-item">
                              <ion-icon
                                name="information-circle-outline"
                              ></ion-icon>
                              <span>{{ tpl.description }}</span>
                            </div>
                          }
                          <div class="template-meta-item">
                            <ion-icon name="create-outline"></ion-icon>
                            <span class="template-preview">{{
                              tpl.template
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                @if (templateTotalPages() > 1) {
                  <div class="pagination" style="padding-top: 16px;">
                    <button
                      class="page-btn"
                      [disabled]="templatePage() <= 1"
                      (click)="goToTemplatePage(templatePage() - 1)"
                    >
                      <ion-icon name="chevron-back-outline"></ion-icon>
                      Anterior
                    </button>
                    <span class="page-info"
                      >Pág {{ templatePage() }} de {{ templateTotalPages() }} ·
                      {{ templates().length }} plantillas</span
                    >
                    <button
                      class="page-btn"
                      [disabled]="templatePage() >= templateTotalPages()"
                      (click)="goToTemplatePage(templatePage() + 1)"
                    >
                      Siguiente
                      <ion-icon name="chevron-forward-outline"></ion-icon>
                    </button>
                  </div>
                }
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class WhatsAppComponent implements OnInit, OnDestroy {
  private readonly waNotifier = inject(WaNotifierService);
  private readonly signalr = inject(SignalRService);
  private readonly modalCtrl = inject(ModalController);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  readonly templateService = inject(MessageTemplateService);
  private readonly fb = inject(FormBuilder);

  readonly segment = signal<'conexion' | 'historial' | 'plantillas'>(
    'conexion',
  );

  readonly status = signal<
    'initializing' | 'qr' | 'ready' | 'disconnected' | 'error'
  >('initializing');
  readonly ready = signal(false);
  readonly qrDataUrl = signal<string | null>(null);
  readonly lastChecked = signal<Date | null>(null);
  readonly restarting = signal(false);

  readonly logs = signal<WaMessageLog[]>([]);
  readonly logsTotal = signal(0);
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);
  private readonly pageSize = 10;

  private subs: Subscription[] = [];

  // Template state
  readonly templates = signal<MessageTemplateResponse[]>([]);
  readonly templateSearch = signal('');
  readonly templatePage = signal(1);
  readonly templateTotalPages = signal(1);
  private readonly templatePageSize = 20;
  readonly showTemplateForm = signal(false);
  readonly editingTemplateId = signal<number | null>(null);
  readonly templateSubmitting = signal(false);
  readonly templateFormError = signal<string | null>(null);
  private templateSearchTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly placeholders = [
    { key: '{VehicleInfo}', desc: 'Marca Modelo (Placa)' },
    { key: '{Brand}', desc: 'Marca del vehículo' },
    { key: '{Model}', desc: 'Modelo del vehículo' },
    { key: '{LicensePlate}', desc: 'Placa del vehículo' },
    { key: '{CurrentKm}', desc: 'Kilometraje actual' },
    { key: '{NextAlertKm}', desc: 'Kilometraje de próxima alerta' },
    { key: '{EstimatedWeeklyKm}', desc: 'Kilómetros semanales estimados' },
    { key: '{ClientName}', desc: 'Nombre del cliente' },
    { key: '{ServiceName}', desc: 'Nombre del servicio de la alerta' },
    { key: '{WorkshopName}', desc: 'Nombre o razón social del taller' },
    { key: '{WorkshopRif}', desc: 'RIF del taller' },
    { key: '{WorkshopAddress}', desc: 'Dirección del taller' },
    { key: '{WorkshopCity}', desc: 'Ciudad del taller' },
    { key: '{WorkshopMapsUrl}', desc: 'Enlace Google Maps del taller' },
    { key: '{WorkshopPhone}', desc: 'Teléfono principal del taller' },
    { key: '{WorkshopSecondaryPhone}', desc: 'Teléfono secundario del taller' },
    { key: '{WorkshopEmail}', desc: 'Correo electrónico del taller' },
    { key: '{WorkshopWebsite}', desc: 'Sitio web del taller' },
    { key: '{WorkshopHours}', desc: 'Horario de atención del taller' },
  ];

  templateForm = this.fb.group({
    key: ['', Validators.required],
    description: [''],
    template: ['', Validators.required],
  });

  readonly statusLabel = () => {
    switch (this.status()) {
      case 'ready':
        return 'Conectado';
      case 'qr':
        return 'Esperando escaneo QR';
      case 'initializing':
        return 'Inicializando...';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Error de autenticación';
    }
  };

  constructor() {
    addIcons({
      logoWhatsapp,
      refreshOutline,
      logOutOutline,
      sendOutline,
      chevronBackOutline,
      chevronForwardOutline,
      documentTextOutline,
      createOutline,
      checkmarkCircleOutline,
      arrowBackOutline,
      informationCircleOutline,
      trashOutline,
    });
  }

  ngOnInit() {
    this.fetchInitial();
    this.connectSignalR();
    this.fetchLogs();
  }

  ngOnDestroy() {
    for (const sub of this.subs) sub.unsubscribe();
    this.signalr.stopConnection('whatsapp');
  }

  private fetchInitial() {
    this.waNotifier.getStatus().subscribe({
      next: (res) => {
        this.status.set(res.status);
        this.ready.set(res.ready);
        this.lastChecked.set(new Date());
      },
    });

    this.waNotifier.getQr().subscribe({
      next: (res) => this.qrDataUrl.set(res.qr),
    });
  }

  private fetchLogs(page?: number) {
    const p = page ?? this.currentPage();
    this.waNotifier.getLogs(p, this.pageSize).subscribe({
      next: (res) => {
        this.logs.set(res.items);
        this.logsTotal.set(res.total);
        this.currentPage.set(res.page);
        this.totalPages.set(res.totalPages);
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.fetchLogs(page);
  }

  private connectSignalR() {
    this.signalr.startConnection('whatsapp');

    this.subs.push(
      this.signalr
        .on<{
          ready: boolean;
          status: 'initializing' | 'qr' | 'ready' | 'disconnected' | 'error';
        }>('whatsapp', 'StatusChanged')
        .subscribe((res) => {
          this.status.set(res.status);
          this.ready.set(res.ready);
          this.lastChecked.set(new Date());
        }),
    );

    this.subs.push(
      this.signalr
        .on<{ qr: string | null }>('whatsapp', 'QrChanged')
        .subscribe((res) => {
          this.qrDataUrl.set(res.qr);
        }),
    );

    this.subs.push(
      this.signalr
        .on<{
          messageId: string;
          logId: number;
          success: boolean;
          status: string;
          phone: string;
          error?: string;
        }>('whatsapp', 'MessageSent')
        .subscribe(async (res) => {
          this.fetchLogs(this.currentPage());
          if (res.status === 'Sent') {
            new Audio('/assets/sounds/notification-pop.wav')
              .play()
              .catch(() => {});
          }
          const toast = await this.toastController.create({
            message:
              res.status === 'Sent'
                ? 'Mensaje enviado correctamente'
                : res.status === 'Failed'
                  ? `Error: ${res.error ?? 'no se pudo enviar'}`
                  : 'Enviando...',
            duration: res.status === 'Sending' ? 2000 : 4000,
            color: res.status === 'Sent' ? 'success' : 'danger',
            position: 'bottom',
          });
          toast.present();
        }),
    );
  }

  async openTestModal() {
    const { TestMessageModalComponent } =
      await import('./test-message-modal.component');
    const modal = await this.modalCtrl.create({
      component: TestMessageModalComponent,
      cssClass: 'test-message-modal',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.['queued']) {
      const logId = data['logId'] as number;
      const message = data['message'] as string;
      const phone = data['phone'] as string;
      const newLog: WaMessageLog = {
        id: logId,
        phone: phone ?? '',
        message: message ?? '',
        type: 'Test',
        status: 'Sending',
        errorMessage: null,
        sentBy: 'Tú',
        createdAt: new Date().toISOString(),
      };
      this.logs.update((list) => [newLog, ...list]);
      this.logsTotal.update((c) => c + 1);
      (
        await this.toastController.create({
          message: 'Mensaje agregado a la cola',
          duration: 3000,
          cssClass: 'toast-info',
          position: 'bottom',
        })
      ).present();
    }
  }

  async logout() {
    this.waNotifier.logout().subscribe({
      next: () => {
        this.status.set('disconnected');
        this.ready.set(false);
        this.qrDataUrl.set(null);
        this.toastController
          .create({
            message: 'Sesión de WhatsApp cerrada',
            duration: 3000,
            color: 'success',
            position: 'bottom',
          })
          .then((t) => t.present());
      },
      error: async () => {
        (
          await this.toastController.create({
            message: 'Error al cerrar sesión',
            duration: 3000,
            color: 'danger',
            position: 'bottom',
          })
        ).present();
      },
    });
  }

  restart() {
    this.restarting.set(true);
    this.waNotifier.restart().subscribe({
      next: () => {
        this.status.set('initializing');
        this.qrDataUrl.set(null);
        this.restarting.set(false);
        this.toastController
          .create({
            message: 'Reiniciando cliente WhatsApp...',
            duration: 3000,
            color: 'tertiary',
            position: 'bottom',
          })
          .then((t) => t.present());
      },
      error: async () => {
        this.restarting.set(false);
        (
          await this.toastController.create({
            message: 'Error al reiniciar',
            duration: 3000,
            color: 'danger',
            position: 'bottom',
          })
        ).present();
      },
    });
  }

  // Template methods
  switchToPlantillas() {
    this.segment.set('plantillas');
    this.loadTemplates();
  }

  private loadTemplates() {
    const search = this.templateSearch();
    let params = new HttpParams()
      .set('page', this.templatePage())
      .set('pageSize', this.templatePageSize);

    if (search) {
      params = params.set('search', search);
    }

    this.templateService.loadAll(params).subscribe({
      next: (res) => {
        this.templates.set(res.items);
        this.templateTotalPages.set(res.totalPages || 1);
      },
      error: (err) => {
        console.error('Error loading templates:', err);
      },
    });
  }

  onTemplateSearch(value: string) {
    this.templateSearch.set(value);
    this.templatePage.set(1);
    if (this.templateSearchTimeout) clearTimeout(this.templateSearchTimeout);
    this.templateSearchTimeout = setTimeout(() => this.loadTemplates(), 300);
  }

  goToTemplatePage(page: number) {
    if (page < 1 || page > this.templateTotalPages()) return;
    this.templatePage.set(page);
    this.loadTemplates();
  }

  openNewTemplate() {
    this.editingTemplateId.set(null);
    this.templateForm.reset({ key: '', description: '', template: '' });
    this.templateForm.get('key')?.enable();
    this.templateFormError.set(null);
    this.showTemplateForm.set(true);
  }

  editTemplate(tpl: MessageTemplateResponse) {
    this.editingTemplateId.set(tpl.id);
    this.templateForm.patchValue({
      key: tpl.key,
      description: tpl.description ?? '',
      template: tpl.template,
    });
    this.templateForm.get('key')?.disable();
    this.templateFormError.set(null);
    this.showTemplateForm.set(true);
  }

  cancelTemplateForm() {
    this.showTemplateForm.set(false);
    this.editingTemplateId.set(null);
    this.templateFormError.set(null);
  }

  insertPlaceholder(key: string) {
    const control = this.templateForm.get('template');
    if (!control) return;
    const current = control.value ?? '';
    control.setValue(current + key);
  }

  onTemplateSubmit() {
    if (this.templateForm.invalid || this.templateSubmitting()) return;
    this.templateSubmitting.set(true);
    this.templateFormError.set(null);

    const raw = this.templateForm.getRawValue();

    const editId = this.editingTemplateId();
    const action = editId
      ? this.templateService.update(editId, {
          template: raw.template!,
          description: raw.description || undefined,
        })
      : this.templateService.create({
          key: raw.key!,
          template: raw.template!,
          description: raw.description || undefined,
        });

    action.subscribe({
      next: async () => {
        this.showTemplateForm.set(false);
        this.editingTemplateId.set(null);
        this.templateSubmitting.set(false);
        this.loadTemplates();
        (
          await this.toastController.create({
            message: editId ? 'Plantilla actualizada' : 'Plantilla creada',
            duration: 3000,
            color: 'success',
            position: 'bottom',
          })
        ).present();
      },
      error: (err) => {
        this.templateFormError.set(
          err.error?.message ?? err.message ?? 'Error al guardar plantilla',
        );
        this.templateSubmitting.set(false);
      },
    });
  }

  async deleteTemplate(id: number, key: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar plantilla',
      message: `¿Eliminar la plantilla "${key}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.templateService.delete(id).subscribe({
              next: () => this.loadTemplates(),
              error: async (err) => {
                (
                  await this.toastController.create({
                    message:
                      err.error?.message ?? 'Error al eliminar plantilla',
                    duration: 3000,
                    color: 'danger',
                    position: 'bottom',
                  })
                ).present();
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async activateTemplate(id: number, key: string) {
    const alert = await this.alertController.create({
      header: 'Activar plantilla',
      message: `¿Estás seguro de activar la plantilla "${key}"? La plantilla actual será desactivada.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Activar',
          role: 'confirm',
          handler: () => {
            this.templateService.setActive(id).subscribe({
              next: async () => {
                this.loadTemplates();
                (
                  await this.toastController.create({
                    message: `Plantilla "${key}" activada como oficial`,
                    duration: 3000,
                    color: 'success',
                    position: 'bottom',
                  })
                ).present();
              },
              error: async (err) => {
                (
                  await this.toastController.create({
                    message: err.error?.message ?? 'Error al activar plantilla',
                    duration: 3000,
                    color: 'danger',
                    position: 'bottom',
                  })
                ).present();
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
