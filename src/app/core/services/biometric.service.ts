import { Injectable, signal, computed, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  NativeBiometric,
  BiometryType,
} from '@capgo/capacitor-native-biometric';

@Injectable({ providedIn: 'root' })
export class BiometricService {
  private readonly platform = inject(Platform);
  private readonly credentialsServer = 'autonex-app';

  readonly isAvailable = signal(false);
  readonly biometryType = signal<BiometryType>(BiometryType.NONE);
  readonly hasSavedCredentials = signal(false);

  readonly label = computed(() => {
    const type = this.biometryType();
    switch (type) {
      case BiometryType.TOUCH_ID:
      case BiometryType.FINGERPRINT:
        return 'huella';
      case BiometryType.FACE_ID:
      case BiometryType.FACE_AUTHENTICATION:
        return 'rostro';
      case BiometryType.IRIS_AUTHENTICATION:
        return 'iris';
      default:
        return 'biométrico';
    }
  });

  async init(): Promise<void> {
    if (!this.platform.is('capacitor')) return;
    await this.checkAvailability();
    if (this.isAvailable()) {
      await this.checkSavedCredentials();
    }
  }

  async checkAvailability(): Promise<boolean> {
    try {
      const result = await NativeBiometric.isAvailable({ useFallback: true });
      this.isAvailable.set(result.isAvailable);
      this.biometryType.set(result.biometryType);
      return result.isAvailable;
    } catch {
      this.isAvailable.set(false);
      return false;
    }
  }

  async checkSavedCredentials(): Promise<boolean> {
    try {
      const result = await NativeBiometric.isCredentialsSaved({
        server: this.credentialsServer,
      });
      this.hasSavedCredentials.set(result.isSaved);
      return result.isSaved;
    } catch {
      this.hasSavedCredentials.set(false);
      return false;
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      await NativeBiometric.verifyIdentity({
        title: 'Autenticate para continuar',
        subtitle:
          'Utiliza el método de autenticación de tu dispositivo para acceder',
        description: 'SERVICIO AUTORIZADO GUI&CAR, C.A.',
        useFallback: true,
        negativeButtonText: 'Cancelar',
      });
      return true;
    } catch {
      return false;
    }
  }

  async saveCredentials(email: string, password: string): Promise<void> {
    await NativeBiometric.setCredentials({
      username: email,
      password,
      server: this.credentialsServer,
    });
    this.hasSavedCredentials.set(true);
  }

  async getCredentials(): Promise<{
    username: string;
    password: string;
  } | null> {
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: this.credentialsServer,
      });
      return { username: credentials.username, password: credentials.password };
    } catch {
      return null;
    }
  }

  async deleteCredentials(): Promise<void> {
    await NativeBiometric.deleteCredentials({
      server: this.credentialsServer,
    });
    this.hasSavedCredentials.set(false);
  }
}
