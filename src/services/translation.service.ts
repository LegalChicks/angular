import { Injectable, signal, computed } from '@angular/core';
import { SettingsService } from './settings.service';

export type Language = 'en' | 'tl' | 'il';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    close: string;
    submit: string;
    loading: string;
    error: string;
    success: string;
    search: string;
    refresh: string;
    logout: string;
    login: string;
    register: string;
    dashboard: string;
    profile: string;
    settings: string;
    notifications: string;
    directory: string;
    members: string;
  };
  // Auth
  auth: {
    welcome: string;
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    forgotPassword: string;
    rememberMe: string;
    signIn: string;
    signUp: string;
    alreadyMember: string;
    notMember: string;
    joinNetwork: string;
    resetPassword: string;
    sendResetLink: string;
    backToSignIn: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    overview: string;
    analytics: string;
    business: string;
    supplies: string;
    membership: string;
    welcomeBack: string;
    quickActions: string;
    farmStats: string;
    recentActivity: string;
  };
  // Profile
  profile: {
    myProfile: string;
    editProfile: string;
    name: string;
    email: string;
    role: string;
    memberId: string;
    visibility: string;
    public: string;
    private: string;
    publicDesc: string;
    privateDesc: string;
    saveChanges: string;
    profileUpdated: string;
  };
  // Settings
  settings: {
    title: string;
    general: string;
    security: string;
    preferences: string;
    appearance: string;
    language: string;
    darkMode: string;
    darkModeDesc: string;
    notifications: string;
    emailNotifications: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    twoFactor: string;
    twoFactorDesc: string;
    accountInfo: string;
    settingsSaved: string;
  };
  // Notifications
  notifications: {
    title: string;
    noNotifications: string;
    markAllRead: string;
    newMemberSignup: string;
    weeklySummary: string;
    supplyUpdates: string;
    allNotifications: string;
  };
  // Member Directory
  directory: {
    title: string;
    searchPlaceholder: string;
    noMembers: string;
    memberCount: string;
  };
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private settingsService: SettingsService;

  private translations: Record<Language, Translations> = {
    en: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',
        submit: 'Submit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        search: 'Search',
        refresh: 'Refresh',
        logout: 'Sign out',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        directory: 'Directory',
        members: 'Members',
      },
      auth: {
        welcome: 'Welcome',
        loginTitle: 'Welcome to the Flock: Member Portal',
        registerTitle: 'Magsimula Tayo: Your Journey Begins',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        forgotPassword: 'Forgot your password?',
        rememberMe: 'Remember me',
        signIn: 'Sign in',
        signUp: 'Sign up',
        alreadyMember: 'Already a member? Sign In',
        notMember: 'Not a member yet?',
        joinNetwork: 'Join the Network',
        resetPassword: 'Reset Password',
        sendResetLink: 'Send Reset Link',
        backToSignIn: 'Back to Sign In',
      },
      dashboard: {
        title: 'LCEN Member Dashboard',
        overview: 'Overview',
        analytics: 'AI Insights',
        business: 'Business Suite',
        supplies: 'Supply Hub',
        membership: 'Membership',
        welcomeBack: 'Welcome Back',
        quickActions: 'Quick Actions',
        farmStats: 'Farm Statistics',
        recentActivity: 'Recent Activity',
      },
      profile: {
        myProfile: 'My Profile',
        editProfile: 'Edit Profile',
        name: 'Full Name',
        email: 'Email Address',
        role: 'Member Role',
        memberId: 'Member ID',
        visibility: 'Profile Visibility',
        public: 'Public',
        private: 'Private',
        publicDesc: 'Visible to all members in the directory.',
        privateDesc: 'Hidden from the member directory.',
        saveChanges: 'Save Changes',
        profileUpdated: 'Profile updated successfully!',
      },
      settings: {
        title: 'Settings',
        general: 'General Settings',
        security: 'Security',
        preferences: 'Preferences',
        appearance: 'Appearance',
        language: 'Language',
        darkMode: 'Dark Mode',
        darkModeDesc: 'Enable a dark theme for the dashboard interface.',
        notifications: 'Email Notifications',
        emailNotifications: 'Email Notifications',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmNewPassword: 'Confirm New Password',
        twoFactor: 'Two-Factor Authentication (2FA)',
        twoFactorDesc: 'Add an extra layer of security to your account with two-factor authentication.',
        accountInfo: 'Account Information',
        settingsSaved: 'Settings saved successfully!',
      },
      notifications: {
        title: 'Notifications',
        noNotifications: 'No notifications',
        markAllRead: 'Mark all as read',
        newMemberSignup: 'New Member Signups',
        weeklySummary: 'Weekly Summary Reports',
        supplyUpdates: 'Supply Hub Updates',
        allNotifications: 'All Email Notifications',
      },
      directory: {
        title: 'Member Directory',
        searchPlaceholder: 'Search by name or email...',
        noMembers: 'No Members Found',
        memberCount: 'members found',
      },
    },
    tl: {
      common: {
        save: 'I-save',
        cancel: 'Kanselahin',
        delete: 'Tanggalin',
        edit: 'I-edit',
        view: 'Tingnan',
        close: 'Isara',
        submit: 'Ipasa',
        loading: 'Naglo-load...',
        error: 'Error',
        success: 'Tagumpay',
        search: 'Maghanap',
        refresh: 'I-refresh',
        logout: 'Mag-sign out',
        login: 'Mag-login',
        register: 'Mag-rehistro',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Mga Setting',
        notifications: 'Mga Notification',
        directory: 'Direktoryo',
        members: 'Mga Miyembro',
      },
      auth: {
        welcome: 'Maligayang Pagdating',
        loginTitle: 'Maligayang Pagdating sa Flock: Member Portal',
        registerTitle: 'Magsimula Tayo: Ang Iyong Paglalakbay',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Kumpirmahin ang Password',
        fullName: 'Buong Pangalan',
        forgotPassword: 'Nakalimutan ang password?',
        rememberMe: 'Tandaan ako',
        signIn: 'Mag-sign in',
        signUp: 'Mag-sign up',
        alreadyMember: 'Kasapi na? Mag-sign In',
        notMember: 'Hindi pa kasapi?',
        joinNetwork: 'Sumali sa Network',
        resetPassword: 'I-reset ang Password',
        sendResetLink: 'Ipadala ang Reset Link',
        backToSignIn: 'Bumalik sa Sign In',
      },
      dashboard: {
        title: 'LCEN Member Dashboard',
        overview: 'Pangkalahatan',
        analytics: 'AI Insights',
        business: 'Business Suite',
        supplies: 'Supply Hub',
        membership: 'Pagiging Miyembro',
        welcomeBack: 'Maligayang Pagbabalik',
        quickActions: 'Mabilis na Aksyon',
        farmStats: 'Estadistika ng Sakahan',
        recentActivity: 'Kamakailang Aktibidad',
      },
      profile: {
        myProfile: 'Aking Profile',
        editProfile: 'I-edit ang Profile',
        name: 'Buong Pangalan',
        email: 'Email Address',
        role: 'Rol ng Miyembro',
        memberId: 'Member ID',
        visibility: 'Visibility ng Profile',
        public: 'Pampubliko',
        private: 'Pribado',
        publicDesc: 'Makikita ng lahat ng miyembro sa direktoryo.',
        privateDesc: 'Nakatago mula sa member directory.',
        saveChanges: 'I-save ang Mga Pagbabago',
        profileUpdated: 'Matagumpay na na-update ang profile!',
      },
      settings: {
        title: 'Mga Setting',
        general: 'Pangkalahatang Setting',
        security: 'Seguridad',
        preferences: 'Mga Kagustuhan',
        appearance: 'Itsura',
        language: 'Wika',
        darkMode: 'Dark Mode',
        darkModeDesc: 'I-enable ang dark theme para sa dashboard interface.',
        notifications: 'Mga Email Notification',
        emailNotifications: 'Mga Email Notification',
        changePassword: 'Palitan ang Password',
        currentPassword: 'Kasalukuyang Password',
        newPassword: 'Bagong Password',
        confirmNewPassword: 'Kumpirmahin ang Bagong Password',
        twoFactor: 'Two-Factor Authentication (2FA)',
        twoFactorDesc: 'Magdagdag ng karagdagang layer ng seguridad sa iyong account gamit ang two-factor authentication.',
        accountInfo: 'Impormasyon ng Account',
        settingsSaved: 'Matagumpay na na-save ang mga setting!',
      },
      notifications: {
        title: 'Mga Notification',
        noNotifications: 'Walang notification',
        markAllRead: 'Markahan lahat bilang nabasa',
        newMemberSignup: 'Mga Bagong Miyembro',
        weeklySummary: 'Mga Weekly Summary Report',
        supplyUpdates: 'Mga Supply Hub Update',
        allNotifications: 'Lahat ng Email Notification',
      },
      directory: {
        title: 'Direktoryo ng Miyembro',
        searchPlaceholder: 'Maghanap ayon sa pangalan o email...',
        noMembers: 'Walang Nahanap na Miyembro',
        memberCount: 'mga miyembro ang nahanap',
      },
    },
    il: {
      common: {
        save: 'Idulin',
        cancel: 'Ukasen',
        delete: 'Ikkaten',
        edit: 'Sukatan',
        view: 'Kitaen',
        close: 'Serraen',
        submit: 'Ited',
        loading: 'Ag-load...',
        error: 'Biddut',
        success: 'Naballigi',
        search: 'Agbiruk',
        refresh: 'Refresh',
        logout: 'Ag-logout',
        login: 'Ag-login',
        register: 'Ag-rehistro',
        dashboard: 'Dashboard',
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Dagiti Notipikasion',
        directory: 'Direktorio',
        members: 'Dagiti Kameng',
      },
      auth: {
        welcome: 'Naragsak a Panangabak',
        loginTitle: 'Naragsak a Panangabak iti Flock: Member Portal',
        registerTitle: 'Magsimula Tayo: Ti Panagrugi ti Biagmo',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Kumpirmaen ti Password',
        fullName: 'Naipan ti Nagan',
        forgotPassword: 'Nalipatan ti password?',
        rememberMe: 'Lagipen dak',
        signIn: 'Ag-sign in',
        signUp: 'Ag-sign up',
        alreadyMember: 'Kameng met? Ag-sign In',
        notMember: 'Saan pay a kameng?',
        joinNetwork: 'Ag-join iti Network',
        resetPassword: 'I-reset ti Password',
        sendResetLink: 'Ipadala ti Reset Link',
        backToSignIn: 'Agsubli iti Sign In',
      },
      dashboard: {
        title: 'LCEN Member Dashboard',
        overview: 'Panangkitkita',
        analytics: 'AI Insights',
        business: 'Business Suite',
        supplies: 'Supply Hub',
        membership: 'Panagkameng',
        welcomeBack: 'Naragsak a Panagsubli',
        quickActions: 'Narapid nga Aksion',
        farmStats: 'Estatistika ti Pagtaraken',
        recentActivity: 'Agpayso nga Aktibidad',
      },
      profile: {
        myProfile: 'Ti Profile ko',
        editProfile: 'Sukatan ti Profile',
        name: 'Naipan ti Nagan',
        email: 'Email Address',
        role: 'Rol ti Kameng',
        memberId: 'Member ID',
        visibility: 'Panagkita ti Profile',
        public: 'Publiko',
        private: 'Privado',
        publicDesc: 'Makita ti amin a kameng iti direktorio.',
        privateDesc: 'Naserra manipud iti member directory.',
        saveChanges: 'Idulin dagiti Pagbaliwan',
        profileUpdated: 'Naballigi a na-update ti profile!',
      },
      settings: {
        title: 'Settings',
        general: 'Sangalubongan a Settings',
        security: 'Seguridad',
        preferences: 'Dagiti Pagtarigagay',
        appearance: 'Panagkita',
        language: 'Pagsasao',
        darkMode: 'Dark Mode',
        darkModeDesc: 'I-enable ti dark theme para iti dashboard interface.',
        notifications: 'Dagiti Email Notipikasion',
        emailNotifications: 'Dagiti Email Notipikasion',
        changePassword: 'Baliwan ti Password',
        currentPassword: 'Agdama a Password',
        newPassword: 'Baro a Password',
        confirmNewPassword: 'Kumpirmaen ti Baro a Password',
        twoFactor: 'Two-Factor Authentication (2FA)',
        twoFactorDesc: 'Agnayon ti masansan a layer ti seguridad iti account mo nga agusar ti two-factor authentication.',
        accountInfo: 'Impormasion ti Account',
        settingsSaved: 'Naballigi a na-idulin dagiti settings!',
      },
      notifications: {
        title: 'Dagiti Notipikasion',
        noNotifications: 'Awan ti notipikasion',
        markAllRead: 'Markaan amin a kas nabasa',
        newMemberSignup: 'Dagiti Baro a Kameng',
        weeklySummary: 'Dagiti Weekly Summary Report',
        supplyUpdates: 'Dagiti Supply Hub Update',
        allNotifications: 'Amin a Email Notipikasion',
      },
      directory: {
        title: 'Direktorio ti Kameng',
        searchPlaceholder: 'Agbiruk babaen ti nagan wenno email...',
        noMembers: 'Awan ti Nasarak a Kameng',
        memberCount: 'a kameng ti nasarak',
      },
    },
  };

  // Current language signal
  currentLanguage = signal<Language>('en');

  // Current translations computed
  current = computed(() => this.translations[this.currentLanguage()]);

  constructor() {
    // Load language from settings
    this.loadLanguage();
  }

  private loadLanguage() {
    const settings = JSON.parse(localStorage.getItem('lcen_user_settings') || '{"language":"en"}');
    this.setLanguage(settings.language || 'en');
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Update settings if available
    try {
      const settings = JSON.parse(localStorage.getItem('lcen_user_settings') || '{}');
      settings.language = lang;
      localStorage.setItem('lcen_user_settings', JSON.stringify(settings));
    } catch {}
  }

  t(key: keyof Translations): any {
    return this.current()[key];
  }

  get(key: keyof Translations): any {
    return this.current()[key];
  }
}

