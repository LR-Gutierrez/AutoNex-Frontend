import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { DashboardSkeletonComponent } from '../../shared/components/dashboard-skeleton/dashboard-skeleton.component';
import {
  DashboardService,
  PRESETS,
} from '../../core/services/dashboard.service';
import { SignalRService } from '../../core/services/signalr.service';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { RecurringExpenseService } from '../../core/services/recurring-expense.service';
import { FinancialRecordService } from '../../core/services/financial-record.service';
import { RefreshService } from '../../core/services/refresh.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { CurrencyFormatterPipe } from '../../shared/pipes/currency-formatter.pipe';
import { PresetKey } from '../../core/models/dashboard.model';
import { DailySummaryResponse } from '../../core/models/financial-record.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonIcon } from '@ionic/angular/standalone';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries, ApexChart, ApexStroke, ApexFill, ApexMarkers,
  ApexXAxis, ApexYAxis, ApexGrid, ApexTooltip, ApexDataLabels, ApexLegend,
} from 'ng-apexcharts';
import { addIcons } from 'ionicons';
import {
  statsChartOutline, walletOutline, syncOutline, flameOutline,
  pulseOutline, swapHorizontalOutline, speedometerOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardSkeletonComponent, CurrencyFormatterPipe, CurrencyPipe, DatePipe, DecimalPipe, RouterLink, IonIcon, ChartComponent],
  styles: `
    :host {
      display: block;
      --card-bg: var(--app-surface);
      --glow-blue: 0 0 30px rgba(59, 130, 246, 0.15);
    }

    .fade-transition {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* === CONTENEDOR DE PRESETS CON SCROLL HORIZONTAL === */
    .presets-wrapper {
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      backdrop-filter: blur(8px);
      box-shadow: none;
      border-radius: 16px;
      padding: 6px;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 4px;
      scrollbar-width: thin;
      scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
      -webkit-overflow-scrolling: touch;
      /* Ocultar scrollbar en Chrome/Safari */
      &::-webkit-scrollbar {
        height: 3px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.3);
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.5);
      }
    }

    .presets-wrapper:hover {
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.05);
    }

    /* === BOTONES TIPO CHIP/SEGMENTO === */
    .chip {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      user-select: none;
      color: var(--app-text-muted);
      background: transparent;
      border: 1px solid transparent;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.01em;
      position: relative;
      overflow: hidden;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex: 0 0 auto;
      white-space: nowrap;
    }

    .chip::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle at center,
        rgba(59, 130, 246, 0.1),
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .chip:hover::before {
      opacity: 1;
    }

    .chip:hover {
      background: var(--app-surface-2);
      color: var(--app-text);
      transform: translateY(-1px);
    }

    .chip:active {
      transform: scale(0.95);
    }

    /* === ICONOS EN PRESETS === */
    .chip-icon {
      font-size: 14px;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .chip-active .chip-icon {
      opacity: 1;
    }

    /* === ESTADO SELECCIONADO === */
    .chip-active {
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.25) 0%,
        rgba(99, 102, 241, 0.15) 100%
      ) !important;
      border: 1px solid rgba(59, 130, 246, 0.4) !important;
      color: #3b82f6 !important;
      font-weight: 700;
      box-shadow:
        0 0 20px rgba(59, 130, 246, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      transform: translateY(-1px);
    }

    .chip-active::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #818cf8);
      border-radius: 2px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        width: 0;
        opacity: 0;
      }
      to {
        width: 20px;
        opacity: 1;
      }
    }

    /* === INDICADOR DE RANGO PERSONALIZADO === */
    .custom-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.15);
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      color: #93bbfc;
    }

    .custom-indicator .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #3b82f6;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%,
      100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    /* === MEJORA DE FILTROS DE FECHA === */
    .date-filter-container {
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 16px;
      padding: 20px 24px;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
      animation: fadeSlideDown 0.3s ease;
    }

    @keyframes fadeSlideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .date-filter-container:hover {
      border-color: rgba(59, 130, 246, 0.2);
      background: rgba(255, 255, 255, 0.035);
    }

    .date-filter-group {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .date-filter-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .date-filter-label span {
      font-size: 14px;
    }

    .date-filter-input {
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 10px;
      padding: 10px 16px;
      color: var(--app-text);
      font-size: 13px;
      font-weight: 500;
      outline: none;
      transition: all 0.25s ease;
      backdrop-filter: blur(4px);
      min-width: 150px;
      cursor: pointer;
    }
    .date-filter-input:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.08);
    }
    .date-filter-input:focus {
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow:
        0 0 0 4px rgba(59, 130, 246, 0.08),
        0 0 20px rgba(59, 130, 246, 0.05);
      background: rgba(255, 255, 255, 0.08);
    }
    .date-filter-input::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
      opacity: 0.6;
      transition:
        opacity 0.2s,
        transform 0.2s;
      padding: 4px;
      border-radius: 4px;
    }
    .date-filter-input::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .date-filter-separator {
      color: var(--app-text-muted);
      font-weight: 300;
      font-size: 20px;
      padding: 0 4px;
      opacity: 0.4;
    }

    .date-filter-error {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: #ff5a52;
      background: rgba(255, 59, 48, 0.08);
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255, 59, 48, 0.12);
      margin-top: 12px;
      animation: shake 0.4s ease;
    }

    .date-filter-error-icon {
      font-size: 16px;
    }

    .date-filter-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .date-filter-clear {
      background: var(--app-surface-2);
      border: 1px solid var(--app-border);
      border-radius: 8px;
      padding: 8px 14px;
      color: var(--app-text-muted);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .date-filter-clear:hover {
      background: rgba(255, 59, 48, 0.1);
      border-color: rgba(255, 59, 48, 0.2);
      color: #ff5a52;
      transform: translateY(-1px);
    }
    .date-filter-clear:active {
      transform: scale(0.95);
    }

    .date-filter-apply {
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.2),
        rgba(99, 102, 241, 0.15)
      );
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 8px;
      padding: 8px 20px;
      color: #93bbfc;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .date-filter-apply:hover {
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.3),
        rgba(99, 102, 241, 0.25)
      );
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }
    .date-filter-apply:active {
      transform: scale(0.95);
    }

    .date-filter-apply:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    @keyframes shake {
      0%,
      100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-4px);
      }
      75% {
        transform: translateX(4px);
      }
    }

    /* === STAT CARDS === */
    .stat-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(12px);
      border: 1px solid var(--app-border);
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow:
        var(--glow-blue),
        0 8px 30px rgba(0, 0, 0, 0.3);
      border-color: rgba(59, 130, 246, 0.2);
    }

    .detail-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(12px);
      border: 1px solid var(--app-border);
    }
    .detail-card:hover {
      border-color: rgba(59, 130, 246, 0.15);
      box-shadow: var(--glow-blue);
    }

    .stat-value {
      font-size: 42px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.04em;
      background: linear-gradient(135deg, #f3f4fb 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value-danger {
      background: linear-gradient(135deg, #ff5a52 0%, #ff8a80 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-value-success {
      background: linear-gradient(135deg, #4ade80 0%, #86efac 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .badge {
      padding: 4px 14px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      backdrop-filter: blur(4px);
    }

    .low-stock-item {
      transition: all 0.2s ease;
      cursor: default;
    }
    .low-stock-item:hover {
      background: rgba(255, 59, 48, 0.12);
      transform: translateX(4px);
    }

    .metric-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 14px;
      padding: 14px;
      transition: all 0.2s ease;
    }
    .metric-box:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--app-text) 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* === RESPONSIVE - SOLO PARA PRESETS CON SCROLL === */
    /* Tablets y dispositivos medianos */
    @media (max-width: 1024px) {
      .stat-value {
        font-size: 36px;
      }

      .chip {
        font-size: 12px;
        padding: 6px 14px;
        min-height: 36px;
      }
    }

    /* Móviles grandes y tablets pequeñas */
    @media (max-width: 768px) {
      .presets-wrapper {
        padding: 4px;
        border-radius: 12px;
        gap: 3px;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      .chip {
        padding: 6px 12px;
        font-size: 11px;
        min-height: 32px;
        flex: 0 0 auto;
        min-width: fit-content;
        justify-content: center;
        border-radius: 10px;
        /* Asegurar que los botones no se envuelvan */
        white-space: nowrap;
      }

      .chip-icon {
        font-size: 12px;
      }

      .chip-active::after {
        width: 14px;
        bottom: 1px;
      }

      /* Indicador visual de scroll en móvil */
      .presets-wrapper::after {
        content: '';
        position: sticky;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20px;
        background: linear-gradient(
          to right,
          transparent,
          rgba(15, 23, 42, 0.6)
        );
        pointer-events: none;
        flex-shrink: 0;
      }

      .stat-value {
        font-size: 28px;
      }

      .stat-card {
        padding: 16px !important;
        min-height: 110px !important;
      }

      .date-filter-group {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }

      .date-filter-label {
        font-size: 10px;
      }

      .date-filter-input {
        min-width: 100%;
        padding: 8px 12px;
        font-size: 12px;
      }

      .date-filter-separator {
        text-align: center;
        padding: 0;
        font-size: 16px;
      }

      .date-filter-actions {
        margin-left: 0;
        margin-top: 4px;
        justify-content: stretch;
      }

      .date-filter-actions button {
        flex: 1;
        text-align: center;
        justify-content: center;
        font-size: 11px;
        padding: 8px 12px;
      }

      .date-filter-container {
        padding: 14px 16px;
        border-radius: 14px;
      }

      .detail-card {
        padding: 16px !important;
      }

      .metric-box {
        padding: 12px;
      }

      .metric-box span.block {
        font-size: 20px !important;
      }
    }

    /* Móviles pequeños */
    @media (max-width: 480px) {
      .presets-wrapper {
        padding: 3px;
        border-radius: 10px;
        gap: 2px;
      }

      .chip {
        padding: 4px 10px;
        font-size: 10px;
        min-height: 28px;
        border-radius: 8px;
        gap: 4px;
      }

      .chip-icon {
        font-size: 10px;
      }

      .chip-active::after {
        width: 10px;
        height: 1.5px;
        bottom: 0;
      }

      .stat-value {
        font-size: 24px;
      }

      .stat-card {
        padding: 14px !important;
        min-height: 100px !important;
      }

      .badge {
        font-size: 9px;
        padding: 3px 10px;
      }

      .date-filter-container {
        padding: 12px 12px;
        border-radius: 12px;
      }

      .date-filter-input {
        padding: 6px 10px;
        font-size: 11px;
        border-radius: 8px;
        min-height: 36px;
      }

      .date-filter-label {
        font-size: 9px;
      }

      .date-filter-actions button {
        font-size: 10px;
        padding: 6px 10px;
        min-height: 32px;
      }

      .detail-card {
        padding: 14px !important;
        border-radius: 16px !important;
      }

      .detail-card h2 {
        font-size: 16px !important;
        margin-bottom: 12px !important;
      }

      .metric-box {
        padding: 10px 8px;
        border-radius: 10px;
      }

      .metric-box span.block {
        font-size: 18px !important;
      }

      .metric-box span.text-xs {
        font-size: 9px !important;
      }

      .status-text {
        display: none;
      }
    }

    /* === CHART CARD === */
    .chart-card {
      background: var(--card-bg);
      border: 1px solid var(--app-border);
      border-radius: 16px;
      padding: 20px;
      transition: all 0.3s ease;
    }
    .chart-card:hover {
      border-color: rgba(59, 130, 246, 0.15);
      box-shadow: var(--glow-blue);
    }

    .chart-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
    }
    .chart-container::-webkit-scrollbar {
      height: 4px;
    }
    .chart-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .chart-container::-webkit-scrollbar-thumb {
      background: rgba(59, 130, 246, 0.3);
      border-radius: 10px;
    }

    apx-chart {
      .apexcharts-tooltip {
        background: rgba(15, 23, 42, 0.96) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        backdrop-filter: blur(8px);
      }
    }

    /* Para pantallas muy pequeñas (menos de 360px) */
    @media (max-width: 360px) {
      .chip {
        font-size: 9px;
        padding: 3px 8px;
        min-height: 24px;
        gap: 3px;
      }

      .chip-icon {
        font-size: 9px;
      }

      .stat-value {
        font-size: 20px;
      }

      .stat-card {
        padding: 12px !important;
        min-height: 90px !important;
      }

      .stat-card .text-xs {
        font-size: 9px !important;
      }

      .date-filter-container {
        padding: 10px 10px;
      }

      .date-filter-input {
        font-size: 10px;
        padding: 5px 8px;
        min-height: 32px;
      }

      .metric-box span.block {
        font-size: 16px !important;
      }
    }
  `,
  template: `
    <div class="p-6 max-md:p-4 text-(--app-text) box-border">
      <!-- Header -->
      <section class="mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h1
              class="m-0 text-[38px] max-md:text-[30px] max-sm:text-[24px] leading-[1.1] font-extrabold tracking-[-0.03em] gradient-text"
            >
              Panel de Control
            </h1>
            <p
              class="mt-1.5 text-(--app-text-muted) text-sm max-sm:text-xs font-medium tracking-wide"
            >
              Resumen operativo de la red de servicios AutoNex
            </p>
          </div>
          <div class="flex items-center gap-2 max-sm:hidden">
            @if (signalr.dashboardStatus() === 'connected') {
              <div
                class="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"
              ></div>
              <span
                class="text-xs text-(--app-text-muted) font-medium status-text"
                >En vivo</span
              >
            } @else if (signalr.dashboardStatus() === 'connecting' || signalr.dashboardStatus() === 'reconnecting') {
              <div
                class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"
              ></div>
              <span
                class="text-xs text-amber-400 font-medium status-text"
                >Conectando...</span
              >
            } @else {
              <div
                class="w-2.5 h-2.5 rounded-full bg-gray-500"
              ></div>
              <span
                class="text-xs text-(--app-text-muted) font-medium status-text"
                >Sin conexión</span
              >
            }
          </div>
        </div>
      </section>

      <!-- PRESETS CON SCROLL HORIZONTAL EN MÓVIL -->
      <div class="presets-wrapper mb-6">
        @for (preset of presets; track preset.key) {
          <button
            class="chip"
            [class.chip-active]="
              dashboard.selectedRange().preset === preset.key
            "
            (click)="selectPreset(preset.key)"
          >
            <ion-icon [name]="getPresetIcon(preset.key)" class="chip-icon text-sm"></ion-icon>
            <span class="chip-label">{{ preset.label }}</span>
          </button>
        }
      </div>

      <!-- Custom Range -->
      @if (dashboard.selectedRange().preset === 'custom') {
        <div class="date-filter-container mb-6">
          <div class="date-filter-group">
            <div class="date-filter-label"><ion-icon name="calendar-outline" class="text-sm"></ion-icon> Desde</div>
            <input
              type="date"
              class="date-filter-input"
              [value]="customStart()"
              (change)="onCustomStart($event)"
            />

            <span class="date-filter-separator">—</span>

            <div class="date-filter-label"><ion-icon name="calendar-outline" class="text-sm"></ion-icon> Hasta</div>
            <input
              type="date"
              class="date-filter-input"
              [value]="customEnd()"
              (change)="onCustomEnd($event)"
            />

            <div class="date-filter-actions">
              <button
                class="date-filter-clear"
                (click)="clearCustomRange()"
                type="button"
              >
                ✕ Limpiar
              </button>
              <button
                class="date-filter-apply"
                [disabled]="rangeInvalid() || !customStart() || !customEnd()"
                (click)="applyCustomRange()"
                type="button"
              >
                ✓ Aplicar
              </button>
            </div>
          </div>

          @if (rangeInvalid()) {
            <div class="date-filter-error">
              <ion-icon name="warning-outline" class="text-sm text-[#ff5a52]"></ion-icon>
              La fecha de inicio no puede ser posterior a la de fin
            </div>
          }
        </div>
      }

      <!-- Date Range Label -->
      @if (
        dashboard.selectedRange().preset !== 'today' && !dashboard.loading()
      ) {
        <p
          class="text-xs text-(--app-text-muted) font-medium mb-5 flex items-center gap-2 max-sm:text-[10px]"
        >
          <ion-icon name="calendar-outline" class="text-sm text-(--app-text-muted)"></ion-icon>
          Mostrando del
          {{ dashboard.selectedRange().startDate | date: 'dd/MM/yyyy' }} al
          {{ dashboard.selectedRange().endDate | date: 'dd/MM/yyyy' }}
        </p>
      }

      <!-- Loading -->
      @if (dashboard.loading()) {
        <div class="fade-transition">
          <app-dashboard-skeleton />
        </div>
      }
      <!-- Error -->
      @else if (dashboard.error()) {
        <div
          class="flex items-center justify-center p-8 rounded-2xl bg-[rgba(255,59,48,0.06)] border border-[rgba(255,59,48,0.12)] mb-6"
        >
          <div class="text-center">
            <ion-icon name="warning-outline" class="text-3xl mb-2 block text-[#ff5a52]"></ion-icon>
            <p class="text-[#ff5a52] text-sm font-medium">
              Error al cargar datos: {{ dashboard.error() }}
            </p>
          </div>
        </div>
      }
      <!-- Stats -->
      @else {
        <section
          class="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-4 mb-6 fade-transition"
        >
          <!-- Orders -->
          <div
            class="stat-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5 min-h-[130px]"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[10px] font-bold uppercase tracking-[0.1em]"
                >Órdenes</span
              >
              <span
                class="text-[10px] max-sm:text-[8px] bg-[rgba(34,197,94,0.12)] text-[#4ade80] px-2.5 py-1 rounded-full font-bold"
                >+12%</span
              >
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div class="stat-value">
                {{ dashboard.data()?.ordersToday?.total ?? 0 }}
              </div>
              <div class="badge bg-[rgba(34,197,94,0.12)] text-[#4ade80]">
                \${{
                  dashboard.data()?.ordersToday?.totalAmount?.toFixed(0) ?? '0'
                }}
              </div>
            </div>
            <div
              class="flex gap-3 mt-3 text-xs max-sm:text-[9px] text-(--app-text-muted) font-medium flex-wrap"
            >
              <span
                >{{ dashboard.data()?.ordersToday?.open ?? 0 }} abiertas</span
              >
              <span>•</span>
              <span
                >{{ dashboard.data()?.ordersToday?.inProgress ?? 0 }} en
                progreso</span
              >
              <span>•</span>
              <span
                >{{
                  dashboard.data()?.ordersToday?.completed ?? 0
                }}
                completadas</span
              >
              <span>•</span>
              <span
                >{{
                  dashboard.data()?.ordersToday?.paid ?? 0
                }}
                pagadas</span
              >
            </div>
          </div>

          <!-- Low Stock -->
          <div
            class="stat-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5 min-h-[130px]"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[10px] font-bold uppercase tracking-[0.1em]"
                >Stock bajo</span
              >
              @if ((dashboard.data()?.lowStock?.items?.length ?? 0) > 0) {
                <span
                  class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
                ></span>
              }
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div class="stat-value">
                {{ dashboard.data()?.lowStock?.items?.length ?? 0 }}
              </div>
              @if ((dashboard.data()?.lowStock?.items?.length ?? 0) > 0) {
                <div class="badge bg-[rgba(245,158,11,0.12)] text-amber-400">
                  por reordenar
                </div>
              }
            </div>
            @if ((dashboard.data()?.lowStock?.items?.length ?? 0) === 0) {
              <p
                class="text-xs max-sm:text-[9px] text-(--app-text-muted) mt-3 font-medium"
              >
                <ion-icon name="checkmark-circle-outline" class="text-sm text-[#4ade80] align-text-bottom"></ion-icon> Todo en orden
              </p>
            }
          </div>

          <!-- KM Alerts -->
          <div
            class="stat-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5 min-h-[130px]"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[10px] font-bold uppercase tracking-[0.1em]"
                >Alertas KM</span
              >
              @if ((dashboard.data()?.kmAlerts?.completed ?? 0) > 0) {
                <span
                  class="text-[10px] max-sm:text-[8px] bg-[rgba(255,59,48,0.12)] text-[#ff5a52] px-2.5 py-1 rounded-full font-bold animate-pulse"
                  >URGENTE</span
                >
              }
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div class="stat-value stat-value-danger">
                {{
                  (dashboard.data()?.kmAlerts?.pending ?? 0) +
                    (dashboard.data()?.kmAlerts?.completed ?? 0)
                }}
              </div>
              <div class="badge bg-[rgba(255,59,48,0.12)] text-[#ff5a52]">
                {{ dashboard.data()?.kmAlerts?.completed ?? 0 }} completadas
              </div>
            </div>
            <div
              class="flex gap-3 mt-3 text-xs max-sm:text-[9px] text-(--app-text-muted) font-medium flex-wrap"
            >
              <span>{{ dashboard.data()?.kmAlerts?.pending ?? 0 }} pendientes</span>
              <span>•</span>
              <span
                >{{ dashboard.data()?.kmAlerts?.completed ?? 0 }} completadas</span
              >
            </div>
          </div>

          <!-- Finances -->
          <div
            class="stat-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5 min-h-[130px]"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[10px] font-bold uppercase tracking-[0.1em]"
                >Finanzas</span
              >
              <span
                class="text-[10px] max-sm:text-[8px] text-(--app-text-muted) font-medium"
                >mes actual</span
              >
            </div>
            <div class="flex items-end justify-between gap-2.5">
              <div
                class="stat-value"
                [class.stat-value-success]="
                  (dashboard.data()?.financialMonth?.balance ?? 0) >= 0
                "
              >
                {{
                  dashboard.data()?.financialMonth?.balance | currencyFormat
                }}
              </div>
              <div
                class="badge"
                [class.bg-[rgba(34,197,94,0.12)]]="
                  (dashboard.data()?.financialMonth?.balance ?? 0) >= 0
                "
                [class.text-[#4ade80]]="
                  (dashboard.data()?.financialMonth?.balance ?? 0) >= 0
                "
                [class.bg-[rgba(255,59,48,0.12)]]="
                  (dashboard.data()?.financialMonth?.balance ?? 0) < 0
                "
                [class.text-[#ff5a52]]="
                  (dashboard.data()?.financialMonth?.balance ?? 0) < 0
                "
              >
                {{
                  (dashboard.data()?.financialMonth?.balance ?? 0) >= 0
                    ? 'positivo'
                    : 'negativo'
                }}
              </div>
            </div>
            <div
              class="flex gap-3 mt-3 text-xs max-sm:text-[9px] text-(--app-text-muted) font-medium flex-wrap"
            >
                <span class="flex items-center gap-1"
                ><ion-icon name="trending-up-outline" class="text-sm text-[#4ade80]"></ion-icon>
                {{
                  dashboard.data()?.financialMonth?.totalIncome | currencyFormat
                }}</span
              >
              <span>•</span>
              <span class="flex items-center gap-1"
                ><ion-icon name="trending-down-outline" class="text-sm text-[#ff6b63]"></ion-icon>
                {{
                  dashboard.data()?.financialMonth?.totalExpenses | currencyFormat
                }}</span
              >
            </div>
          </div>
        </section>
      }

      <!-- Detail Sections -->
      <section class="min-w-0 fade-transition flex flex-col gap-4">
        <!-- Full-width Line Chart -->
        <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-(--app-text) text-lg max-sm:text-base font-bold m-0 flex items-center gap-2">
              <ion-icon name="stats-chart-outline" class="text-[#818cf8] text-xl"></ion-icon>
              Ingresos vs Egresos
            </h2>
            <div class="flex items-center gap-3 text-xs text-(--app-text-muted) font-medium">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#4ade80]"></span>
                Ingresos
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff6b63]"></span>
                Egresos
              </span>
            </div>
          </div>
          <p class="text-(--app-text-muted) text-xs max-sm:text-[10px] font-medium mb-4">
            {{ dashboard.data()?.financialMonth?.totalIncome | currencyFormat }} ingresos ·
            {{ dashboard.data()?.financialMonth?.totalExpenses | currencyFormat }} egresos ·
            Balance
            <span [class.text-[#4ade80]]="(dashboard.data()?.financialMonth?.balance ?? 0) >= 0"
                  [class.text-[#ff6b63]]="(dashboard.data()?.financialMonth?.balance ?? 0) < 0">
              {{ dashboard.data()?.financialMonth?.balance | currencyFormat }}
            </span>
          </p>

          @if (chartOptions(); as opts) {
            <apx-chart
              [series]="opts.series"
              [chart]="opts.chart"
              [xaxis]="opts.xaxis"
              [yaxis]="opts.yaxis"
              [stroke]="opts.stroke"
              [fill]="opts.fill"
              [markers]="opts.markers"
              [colors]="opts.colors"
              [grid]="opts.grid"
              [tooltip]="opts.tooltip"
              [dataLabels]="opts.dataLabels"
              [legend]="opts.legend"
              style="height: 220px;"
            />
          } @else if (chartLoading()) {
            <div class="flex items-center justify-center py-10 text-(--app-text-muted) text-sm">
              Cargando datos del gráfico...
            </div>
          } @else {
            <div class="flex items-center justify-center py-10 text-(--app-text-muted) text-sm">
              No hay datos financieros en este período
            </div>
          }
        </div>

        <!-- Compact Cards Row -->
        <div class="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
          <!-- Orders Compact -->
          <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
            <h3 class="text-(--app-text) text-sm font-bold m-0 mb-3 flex items-center gap-2">
              <ion-icon name="clipboard-outline" class="text-[#818cf8] text-sm"></ion-icon> Órdenes
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div class="metric-box text-center !p-2.5">
                <span class="block text-[18px] font-extrabold text-amber-400">
                  {{ dashboard.data()?.ordersToday?.open ?? 0 }}
                </span>
                <span class="text-(--app-text-muted) text-[10px] font-medium">Abiertas</span>
              </div>
              <div class="metric-box text-center !p-2.5">
                <span class="block text-[18px] font-extrabold text-blue-400">
                  {{ dashboard.data()?.ordersToday?.inProgress ?? 0 }}
                </span>
                <span class="text-(--app-text-muted) text-[10px] font-medium">Progreso</span>
              </div>
              <div class="metric-box text-center !p-2.5">
                <span class="block text-[18px] font-extrabold text-green-400">
                  {{ dashboard.data()?.ordersToday?.completed ?? 0 }}
                </span>
                <span class="text-(--app-text-muted) text-[10px] font-medium">Completadas</span>
              </div>
              <div class="metric-box text-center !p-2.5">
                <span class="block text-[18px] font-extrabold text-violet-400">
                  {{ dashboard.data()?.ordersToday?.paid ?? 0 }}
                </span>
                <span class="text-(--app-text-muted) text-[10px] font-medium">Pagadas</span>
              </div>
            </div>
            @if ((dashboard.data()?.lowStock?.items?.length ?? 0) > 0) {
              <div class="mt-2 pt-2 border-t border-(--app-border)">
                <div class="flex flex-wrap gap-1.5">
                  @for (item of dashboard.data()?.lowStock?.items ?? []; track item.id) {
                    <span class="text-[10px] text-[#ff5a52] font-medium bg-[rgba(255,59,48,0.08)] px-2 py-0.5 rounded-full">
                      {{ item.name }} ({{ item.stockQuantity }}/{{ item.minStock }})
                    </span>
                  }
                </div>
              </div>
            }
          </div>

          <!-- KM Alerts -->
          <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
            <h3 class="text-(--app-text) text-sm font-bold m-0 mb-3 flex items-center gap-2">
              <ion-icon name="speedometer-outline" class="text-[#fbbf24] text-sm"></ion-icon> Alertas KM
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div class="metric-box text-center !p-2.5">
                <span class="block text-[18px] font-extrabold text-amber-400">
                  {{ dashboard.data()?.kmAlerts?.pending ?? 0 }}
                </span>
                <span class="text-(--app-text-muted) text-[10px] font-medium">Pendientes</span>
              </div>
              <div class="metric-box text-center !p-2.5 border-[rgba(255,59,48,0.2)]">
                <span class="block text-[18px] font-extrabold text-[#ff5a52]">
                  {{ dashboard.data()?.kmAlerts?.completed ?? 0 }}
                </span>
                <span class="text-(--app-text-muted) text-[10px] font-medium">Completadas</span>
              </div>
            </div>
          </div>

          <!-- Mock: Servicios Populares -->
          <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
            <h3 class="text-(--app-text) text-sm font-bold m-0 mb-3 flex items-center gap-2">
              <ion-icon name="flame-outline" class="text-orange-400 text-sm"></ion-icon> Servicios Populares
            </h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Cambio de Aceite</span>
                <span class="text-(--app-text-muted)">24 servicios</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Alineación</span>
                <span class="text-(--app-text-muted)">18 servicios</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Balanceo</span>
                <span class="text-(--app-text-muted)">15 servicios</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Frenos</span>
                <span class="text-(--app-text-muted)">12 servicios</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle Row -->
        <div class="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
          <!-- Account Balances -->
          @if (dashboard.data()?.financialMonth?.balances; as balances) {
            <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
              <h3 class="text-(--app-text) text-sm font-bold m-0 mb-3 flex items-center gap-2">
                <ion-icon name="wallet-outline" class="text-[#818cf8] text-sm"></ion-icon> Saldos por Cuenta
              </h3>
              <div class="grid grid-cols-2 gap-2">
                @for (bal of balances; track bal.accountType) {
                  <div class="metric-box text-center !p-2.5">
                    <span class="block text-[18px] font-extrabold mb-0.5"
                      [class.text-blue-400]="bal.accountType === 'Bolivares'"
                      [class.text-amber-400]="bal.accountType === 'Dolares'">
                      {{ bal.accountType === 'Bolivares' ? 'Bs.' : '$' }}
                      {{ bal.balance | number:'1.2-2' }}
                    </span>
                    @if (bal.accountType === 'Bolivares' && usdRate()) {
                      <span class="block text-[10px] text-(--app-text-muted) leading-tight">
                        ≈ {{ bal.balance / usdRate() | currency:'USD':'symbol':'1.2-2' }}
                      </span>
                    }
                    <span class="text-(--app-text-muted) text-[10px] font-medium">
                      {{ bal.accountType === 'Bolivares' ? 'Bolívares' : 'Dólares' }}
                    </span>
                  </div>
                }
              </div>
              <div class="mt-2 text-center">
                <a routerLink="/financial-records"
                  class="text-[10px] text-(--app-text-muted) font-medium hover:text-(--app-text) transition-colors no-underline">
                  Ver detalle →
                </a>
              </div>
            </div>
          }

          <!-- Recurring Expenses -->
          <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
            <h3 class="text-(--app-text) text-sm font-bold m-0 mb-3 flex items-center gap-2">
              <ion-icon name="sync-outline" class="text-[#818cf8] text-sm"></ion-icon> Gastos Fijos
            </h3>
            @let due = recurringExpenseService.dueToday();
            @if (due.length > 0) {
              <div class="space-y-1.5">
                @for (item of due; track item.id) {
                  <div class="flex items-center justify-between bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] rounded-xl px-3 py-2">
                    <div class="min-w-0">
                      <span class="block text-sm font-semibold text-(--app-text) truncate">
                        {{ item.expenseName }}
                      </span>
                      <span class="text-[10px] text-(--app-text-muted)">Vence hoy</span>
                    </div>
                    <span class="text-sm font-bold text-[#fbbf24] shrink-0 ml-2">
                      {{ item.amount | currency:'USD':'symbol':'1.2-2' }}
                    </span>
                  </div>
                }
              </div>
              <div class="mt-2 text-center">
                <a routerLink="/financial-records"
                  class="text-[10px] text-(--app-text-muted) font-medium hover:text-(--app-text) transition-colors no-underline">
                  Ver todos →
                </a>
              </div>
            } @else {
              <div class="text-center py-4 text-(--app-text-muted) text-sm">
                <ion-icon name="checkmark-circle-outline" class="block text-base mb-0.5 text-[#4ade80] mx-auto"></ion-icon>
                Sin gastos pendientes hoy
              </div>
            }
          </div>

          <!-- Mock: Inventario Rápido -->
          <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
            <h3 class="text-(--app-text) text-sm font-bold m-0 mb-3 flex items-center gap-2">
              <ion-icon name="cube-outline" class="text-amber-400 text-sm"></ion-icon> Inventario Rápido
            </h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Aceite 20W50</span>
                <span class="text-[#4ade80] font-bold">48 uds</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Filtro de Aceite</span>
                <span class="text-[#fbbf24] font-bold">23 uds</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Pastillas de Freno</span>
                <span class="text-[#ff5a52] font-bold">6 uds</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-(--app-text) font-medium">Llantas 205/55R16</span>
                <span class="text-[#4ade80] font-bold">32 uds</span>
              </div>
            </div>
          </div>

          <!-- Exchange Rate -->
          @if (dashboard.data()?.exchangeRate) {
            <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
              <h3 class="text-(--app-text) text-sm font-bold m-0 mb-2 flex items-center gap-2">
                <ion-icon name="swap-horizontal-outline" class="text-emerald-400 text-sm"></ion-icon> Tasa de Cambio
              </h3>
              <div class="flex items-center justify-between">
                <div>
                  <span class="block text-[22px] font-extrabold text-emerald-400">
                    Bs. {{ dashboard.data()?.exchangeRate?.rate | number:'1.2-2' }}
                  </span>
                  <span class="text-(--app-text-muted) text-[10px] font-medium">
                    {{ dashboard.data()?.exchangeRate?.source }}
                  </span>
                </div>
                <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ion-icon name="cash-outline" class="text-emerald-400 text-xl"></ion-icon>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Mock: Actividad Reciente -->
        <div class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-(--app-text) text-sm font-bold m-0 flex items-center gap-2">
              <ion-icon name="pulse-outline" class="text-[#818cf8] text-sm"></ion-icon> Actividad Reciente
            </h3>
            <span class="text-[10px] text-(--app-text-muted) font-medium">últimas 24h</span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3 text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0"></span>
              <span class="text-(--app-text-muted) flex-1">Orden #1024 completada — Cambio de Aceite</span>
              <span class="text-(--app-text-muted) shrink-0">hace 15min</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#818cf8] shrink-0"></span>
              <span class="text-(--app-text-muted) flex-1">Nueva orden #1025 — Alineación y Balanceo</span>
              <span class="text-(--app-text-muted) shrink-0">hace 42min</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0"></span>
              <span class="text-(--app-text-muted) flex-1">Pago recibido — Cliente: Juan Pérez</span>
              <span class="text-(--app-text-muted) shrink-0">hace 1h</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#ff5a52] shrink-0"></span>
              <span class="text-(--app-text-muted) flex-1">Alerta KM vencida — Vehículo #V-456</span>
              <span class="text-(--app-text-muted) shrink-0">hace 2h</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0"></span>
              <span class="text-(--app-text-muted) flex-1">Stock reabastecido — Filtros de Aceite</span>
              <span class="text-(--app-text-muted) shrink-0">hace 3h</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  readonly dashboard = inject(DashboardService);
  readonly signalr = inject(SignalRService);
  readonly presets = PRESETS;
  protected readonly customStart = signal('');
  protected readonly customEnd = signal('');
  protected readonly rangeInvalid = computed(() => {
    if (this.customStart() && this.customEnd()) {
      return this.customStart() > this.customEnd();
    }
    return false;
  });
  private readonly refreshService = inject(RefreshService);
  private readonly pageTitle = inject(PageTitleService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly financialRecordService = inject(FinancialRecordService);
  protected readonly recurringExpenseService = inject(RecurringExpenseService);
  protected readonly usdRate = signal(0);
  protected readonly dailySummary = signal<DailySummaryResponse[]>([]);
  protected readonly chartLoading = signal(false);

  protected readonly chartOptions = computed(() => {
    const data = this.dailySummary();
    if (!data.length) return null;

    return {
      series: [
        { name: 'Ingresos', data: data.map(d => +d.income.toFixed(2)) },
        { name: 'Egresos', data: data.map(d => +d.expense.toFixed(2)) },
      ] as ApexAxisChartSeries,
      chart: {
        type: 'area',
        height: 220,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, system-ui, sans-serif',
        foreColor: 'rgba(255,255,255,0.35)',
        background: 'transparent',
        animations: { enabled: true, easing: 'easeinout', speed: 800 },
      } as ApexChart,
      colors: ['#4ade80', '#ff6b63'],
      dataLabels: { enabled: false } as ApexDataLabels,
      stroke: { curve: 'smooth', width: 2 } as ApexStroke,
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      } as ApexFill,
      markers: {
        size: 3,
        strokeWidth: 0,
        hover: { size: 6 },
      } as ApexMarkers,
      xaxis: {
        type: 'datetime',
        categories: data.map(d => d.date),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 500 } },
        crosshairs: { show: true, width: 1, stroke: { color: 'rgba(255,255,255,0.08)' } },
      } as ApexXAxis,
      yaxis: {
        labels: {
          style: { colors: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 500 },
          formatter: (val: number) => (val >= 1000 ? '$' + (val / 1000).toFixed(1) + 'k' : '$' + val.toFixed(0)),
        },
      } as ApexYAxis,
      grid: {
        borderColor: 'rgba(255,255,255,0.05)',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { left: 0, right: 0 },
      } as ApexGrid,
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' },
        y: {
          formatter: (val: number) => '$' + val.toFixed(2),
        },
      } as ApexTooltip,
      legend: { show: false } as ApexLegend,
    };
  });

  constructor() {
    addIcons({ statsChartOutline, walletOutline, syncOutline, flameOutline, pulseOutline, swapHorizontalOutline, speedometerOutline });

    effect(() => {
      const range = this.dashboard.selectedRange();
      if (range) {
        this.loadChartData(range.startDate, range.endDate);
      }
    });

    this.refreshService.refresh$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dashboard.load().subscribe();
        this.exchangeRateService.getCurrentUsd().subscribe(r => this.usdRate.set(r.value));
        this.recurringExpenseService.loadDueToday().subscribe();
      });
  }

  private loadChartData(start: string, end: string): void {
    this.chartLoading.set(true);
    this.financialRecordService.getDailySummary(start, end).subscribe({
      next: (data) => {
        this.dailySummary.set(data);
        this.chartLoading.set(false);
      },
      error: () => this.chartLoading.set(false),
    });
  }

  ngOnInit() {
    this.pageTitle.title.set('Panel de Control');
    this.pageTitle.subtitle.set(
      'Resumen operativo de la red de servicios AutoNex',
    );
    this.dashboard.load().subscribe();
    this.exchangeRateService.getCurrentUsd().subscribe(r => this.usdRate.set(r.value));
    this.recurringExpenseService.loadDueToday().subscribe();
  }

  /**
   * Obtiene el ícono correspondiente para cada preset
   */
  getPresetIcon(key: PresetKey): string {
    const icons: Record<PresetKey, string> = {
      today: 'calendar-outline',
      yesterday: 'calendar-outline',
      'this-week': 'stats-chart-outline',
      'this-month': 'trending-up-outline',
      'last-month': 'trending-down-outline',
      custom: 'create-outline',
    };
    return icons[key] || 'ellipse-outline';
  }

  selectPreset(key: PresetKey): void {
    if (key === 'custom') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      this.customStart.set(start.toISOString().slice(0, 10));
      this.customEnd.set(start.toISOString().slice(0, 10));
      this.dashboard.setRange('custom', this.customStart(), this.customEnd());
    } else {
      this.customStart.set('');
      this.customEnd.set('');
      this.dashboard.setRange(key);
    }
  }

  onCustomStart(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.customStart.set(value);
    if (this.customEnd() && !this.rangeInvalid()) {
      this.dashboard.setRange('custom', this.customStart(), this.customEnd());
    }
  }

  onCustomEnd(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.customEnd.set(value);
    if (this.customStart() && !this.rangeInvalid()) {
      this.dashboard.setRange('custom', this.customStart(), this.customEnd());
    }
  }

  clearCustomRange(): void {
    this.customStart.set('');
    this.customEnd.set('');
  }

  applyCustomRange(): void {
    if (this.customStart() && this.customEnd() && !this.rangeInvalid()) {
      this.dashboard.setRange('custom', this.customStart(), this.customEnd());
    }
  }
}
