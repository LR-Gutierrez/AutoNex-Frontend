import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DashboardSkeletonComponent } from '../../shared/components/dashboard-skeleton/dashboard-skeleton.component';
import {
  DashboardService,
  PRESETS,
} from '../../core/services/dashboard.service';
import { SignalRService } from '../../core/services/signalr.service';
import { RefreshService } from '../../core/services/refresh.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { CurrencyFormatterPipe } from '../../shared/pipes/currency-formatter.pipe';
import { PresetKey } from '../../core/models/dashboard.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardSkeletonComponent, CurrencyFormatterPipe, DatePipe, DecimalPipe, RouterLink],
  styles: `
    :host {
      display: block;
      --card-bg: linear-gradient(
        145deg,
        rgba(28, 30, 50, 0.95),
        rgba(20, 22, 40, 0.95)
      );
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
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.03);
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
      color: rgba(243, 244, 251, 0.5);
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
      background: rgba(255, 255, 255, 0.04);
      color: rgba(243, 244, 251, 0.9);
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
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 16px;
      color: #f3f4fb;
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
      color: rgba(255, 255, 255, 0.15);
      font-weight: 300;
      font-size: 20px;
      padding: 0 4px;
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 14px;
      color: rgba(255, 255, 255, 0.4);
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
      border: 1px solid rgba(255, 255, 255, 0.06);
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
      border: 1px solid rgba(255, 255, 255, 0.06);
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
      background: linear-gradient(135deg, #f3f4fb 0%, #818cf8 100%);
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
            <span class="chip-icon">{{ getPresetIcon(preset.key) }}</span>
            <span class="chip-label">{{ preset.label }}</span>
          </button>
        }
      </div>

      <!-- Custom Range -->
      @if (dashboard.selectedRange().preset === 'custom') {
        <div class="date-filter-container mb-6">
          <div class="date-filter-group">
            <div class="date-filter-label"><span>📅</span> Desde</div>
            <input
              type="date"
              class="date-filter-input"
              [value]="customStart()"
              (change)="onCustomStart($event)"
            />

            <span class="date-filter-separator">—</span>

            <div class="date-filter-label"><span>📅</span> Hasta</div>
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
              <span class="date-filter-error-icon">⚠️</span>
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
          <span>📅</span>
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
            <span class="text-3xl mb-2 block">⚠️</span>
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
                ✅ Todo en orden
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
              <span
                >💰
                {{
                  dashboard.data()?.financialMonth?.totalIncome | currencyFormat
                }}</span
              >
              <span>•</span>
              <span
                >💸
                {{
                  dashboard.data()?.financialMonth?.totalExpenses | currencyFormat
                }}</span
              >
            </div>
          </div>
        </section>
      }

      <!-- Detail Sections -->
      <section
        class="grid grid-cols-[minmax(0,2fr)_minmax(300px,0.95fr)] max-xl:grid-cols-1 gap-5 min-w-0 fade-transition"
      >
        <!-- Orders Detail -->
        <div
          class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5"
        >
          <div class="pb-2">
            <h2
              class="text-(--app-text) text-lg max-sm:text-base font-bold m-0 flex items-center gap-2"
            >
              <span>📋</span> Órdenes de Servicio
            </h2>
            <p
              class="text-(--app-text-muted) text-sm max-sm:text-xs m-0 mt-1 font-medium"
            >
              Resumen de {{ dashboard.data()?.ordersToday?.total ?? 0 }} órdenes
            </p>
          </div>

          <div class="grid grid-cols-4 gap-3 mt-4">
            <div class="metric-box text-center">
              <span
                class="block text-[24px] max-sm:text-[20px] font-extrabold text-amber-400"
                >{{ dashboard.data()?.ordersToday?.open ?? 0 }}</span
              >
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                >Abiertas</span
              >
            </div>
            <div class="metric-box text-center">
              <span
                class="block text-[24px] max-sm:text-[20px] font-extrabold text-blue-400"
                >{{ dashboard.data()?.ordersToday?.inProgress ?? 0 }}</span
              >
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                >En Progreso</span
              >
            </div>
            <div class="metric-box text-center">
              <span
                class="block text-[24px] max-sm:text-[20px] font-extrabold text-green-400"
                >{{ dashboard.data()?.ordersToday?.completed ?? 0 }}</span
              >
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                >Completadas</span
              >
            </div>
            <div class="metric-box text-center">
              <span
                class="block text-[24px] max-sm:text-[20px] font-extrabold text-violet-400"
                >{{ dashboard.data()?.ordersToday?.paid ?? 0 }}</span
              >
              <span
                class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                >Pagadas</span
              >
            </div>
          </div>

          <!-- Low Stock Items -->
          @if ((dashboard.data()?.lowStock?.items?.length ?? 0) > 0) {
            <div class="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <h3
                class="text-(--app-text) text-sm max-sm:text-xs font-bold m-0 mb-3 flex items-center gap-2"
              >
                <span>⚠️</span> Items con Stock Bajo
              </h3>
              <div class="grid gap-2">
                @for (
                  item of dashboard.data()?.lowStock?.items ?? [];
                  track item.id
                ) {
                  <div
                    class="low-stock-item flex items-center justify-between p-3 max-sm:p-2 rounded-xl bg-[rgba(255,59,48,0.06)] border border-[rgba(255,59,48,0.1)]"
                  >
                    <span class="text-sm max-sm:text-xs font-medium">{{
                      item.name
                    }}</span>
                    <span
                      class="text-xs max-sm:text-[10px] text-[#ff5a52] font-bold bg-[rgba(255,59,48,0.1)] px-3 py-1 rounded-full"
                    >
                      {{ item.stockQuantity }} / {{ item.minStock }}
                    </span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Right Column -->
        <div class="grid gap-4 min-w-0">
          <!-- KM Alerts Detail -->
          <div
            class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5"
          >
            <h2
              class="text-(--app-text) text-lg max-sm:text-base font-bold m-0 mb-4 flex items-center gap-2"
            >
              <span>🚗</span> Alertas de KM
            </h2>
            <div class="grid grid-cols-2 gap-3">
              <div class="metric-box text-center">
                <span
                  class="block text-[24px] max-sm:text-[20px] font-extrabold text-amber-400"
                  >{{ dashboard.data()?.kmAlerts?.pending ?? 0 }}</span
                >
                <span
                  class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                  >Pendientes</span
                >
              </div>
              <div class="metric-box text-center border-[rgba(255,59,48,0.2)]">
                <span
                  class="block text-[24px] max-sm:text-[20px] font-extrabold text-[#ff5a52]"
                  >{{ dashboard.data()?.kmAlerts?.completed ?? 0 }}</span
                >
                <span
                  class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                  >Completadas</span
                >
              </div>
            </div>
          </div>

          <!-- Exchange Rate Widget -->
          @if (dashboard.data()?.exchangeRate) {
            <div
              class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5"
            >
              <h2
                class="text-(--app-text) text-lg max-sm:text-base font-bold m-0 mb-4 flex items-center gap-2"
              >
                <span>💱</span> Tasa de Cambio
              </h2>
              <div class="flex items-center justify-between">
                <div>
                  <span
                    class="block text-[32px] max-sm:text-[26px] font-extrabold text-emerald-400"
                  >
                    Bs. {{ dashboard.data()?.exchangeRate?.rate | number:'1.2-2' }}
                  </span>
                  <span
                    class="text-(--app-text-muted) text-xs font-medium"
                  >
                    {{ dashboard.data()?.exchangeRate?.source }} · {{ dashboard.data()?.exchangeRate?.date | date:'dd/MM/yyyy' }}
                  </span>
                </div>
                <div
                  class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center"
                >
                  <span class="text-2xl">🇻🇪</span>
                </div>
              </div>
            </div>
          }

          <!-- Account Balances -->
          @if (dashboard.data()?.financialMonth?.balances; as balances) {
            <div
              class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5"
            >
              <h2
                class="text-(--app-text) text-lg max-sm:text-base font-bold m-0 mb-4 flex items-center gap-2"
              >
                <span>💰</span> Saldos por Cuenta
              </h2>
              <div class="grid grid-cols-2 gap-3">
                @for (bal of balances; track bal.accountType) {
                  <div class="metric-box text-center">
                    <span
                      class="block text-[22px] max-sm:text-[18px] font-extrabold mb-1"
                      [class.text-blue-400]="bal.accountType === 'Bolivares'"
                      [class.text-amber-400]="bal.accountType === 'Dolares'"
                    >
                      {{ bal.accountType === 'Bolivares' ? 'Bs.' : '$' }}
                      {{ bal.balance | number:'1.2-2' }}
                    </span>
                    <span
                      class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                    >
                      {{ bal.accountType === 'Bolivares' ? 'Bolívares' : 'Dólares' }}
                    </span>
                  </div>
                }
              </div>
              <div class="mt-3 text-center">
                <a
                  routerLink="/financial-records"
                  class="text-xs text-(--app-text-muted) font-medium hover:text-(--app-text) transition-colors no-underline"
                >
                  Ver detalle →
                </a>
              </div>
            </div>
          }

          <!-- Financial Detail -->
          <div
            class="detail-card bg-(--card-bg) rounded-2xl shadow-(--app-shadow) p-5"
          >
            <h2
              class="text-(--app-text) text-lg max-sm:text-base font-bold m-0 mb-4 flex items-center gap-2"
            >
              <span>📊</span> Resumen Financiero
            </h2>

            <div
              class="grid grid-cols-3 max-md:grid-cols-3 max-sm:grid-cols-1 gap-3"
            >
              <div class="metric-box text-center">
                <span
                  class="block text-[22px] max-sm:text-[18px] font-extrabold mb-1 text-[#4ade80]"
                >
                  {{
                    dashboard.data()?.financialMonth?.totalIncome | currencyFormat
                  }}
                </span>
                <span
                  class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                  >Ingresos</span
                >
              </div>

              <div class="metric-box text-center">
                <span
                  class="block text-[22px] max-sm:text-[18px] font-extrabold mb-1 text-[#ff6b63]"
                >
                  {{
                    dashboard.data()?.financialMonth?.totalExpenses | currencyFormat
                  }}
                </span>
                <span
                  class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                  >Egresos</span
                >
              </div>

              <div
                class="metric-box text-center border-[rgba(255,255,255,0.08)]"
              >
                <span
                  class="block text-[22px] max-sm:text-[18px] font-extrabold mb-1"
                  [class.text-[#4ade80]]="
                    (dashboard.data()?.financialMonth?.balance ?? 0) >= 0
                  "
                  [class.text-[#ff6b63]]="
                    (dashboard.data()?.financialMonth?.balance ?? 0) < 0
                  "
                >
                  {{
                    dashboard.data()?.financialMonth?.balance | currencyFormat
                  }}
                </span>
                <span
                  class="text-(--app-text-muted) text-xs max-sm:text-[9px] font-medium"
                  >Balance</span
                >
              </div>
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

  constructor() {
    this.refreshService.refresh$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dashboard.load().subscribe();
      });
  }

  ngOnInit() {
    this.pageTitle.title.set('Panel de Control');
    this.pageTitle.subtitle.set(
      'Resumen operativo de la red de servicios AutoNex',
    );
    this.dashboard.load().subscribe();
  }

  /**
   * Obtiene el ícono correspondiente para cada preset
   */
  getPresetIcon(key: PresetKey): string {
    const icons: Record<PresetKey, string> = {
      today: '📅',
      yesterday: '📆',
      'this-week': '📊',
      'this-month': '📈',
      'last-month': '📉',
      custom: '✏️',
    };
    return icons[key] || '📌';
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
