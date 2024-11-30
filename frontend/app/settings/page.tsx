'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserSettings {
  emailNotifications: boolean;
  darkMode: boolean;
  full_name: string;
  license_number: string;
  email: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    darkMode: false,
    full_name: '',
    license_number: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadUserSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSettings({
          ...settings,
          full_name: user.user_metadata.full_name || '',
          license_number: user.user_metadata.license_number || '',
          email: user.email || '',
        });
      }
    };

    loadUserSettings();
  }, [supabase.auth]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: settings.full_name,
          license_number: settings.license_number,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Nastavení bylo úspěšně uloženo.',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({
        type: 'error',
        text: 'Došlo k chybě při ukládání nastavení.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Nastavení</h2>
        <p className="text-muted-foreground">
          Spravujte své uživatelské nastavení a předvolby
        </p>
      </div>
      <Separator />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Osobní údaje</CardTitle>
            <CardDescription>
              Aktualizujte své osobní a kontaktní údaje
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert
                variant={message.type === 'error' ? 'destructive' : 'default'}
                className="mb-6"
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Celé jméno</Label>
                <Input
                  id="name"
                  value={settings.full_name}
                  onChange={(e) =>
                    setSettings({ ...settings, full_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={settings.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Číslo licence ČLK</Label>
                <Input
                  id="license"
                  value={settings.license_number}
                  onChange={(e) =>
                    setSettings({ ...settings, license_number: e.target.value })
                  }
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Uložit změny
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifikace</CardTitle>
            <CardDescription>
              Nastavte si způsob upozornění na důležité události
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch
                id="notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
              <Label htmlFor="notifications">Emailová upozornění</Label>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vzhled</CardTitle>
            <CardDescription>
              Přizpůsobte si vzhled aplikace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Switch
                id="theme"
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, darkMode: checked })
                }
              />
              <Label htmlFor="theme">Tmavý režim</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
