import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Home2,
  Icon,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
} from '@codearemo/instollar-sdk';

export function App() {
  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Text variant="spline-bold-h4">Instollar SDK</Text>
        <Text variant="open-regular-p">Barebones design-system playground.</Text>

        <div className="flex flex-wrap items-center gap-3">
          <Button prefix={<Icon icon={Home2} size="sm" color="secondary" />}>Continue</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Badge>New</Badge>
          <Chip selected>Filter</Chip>
        </div>

        <Card className="flex flex-col gap-4">
          <Input label="Email" placeholder="you@example.com" />
          <Textarea label="Notes" placeholder="Optional notes" />
          <Select
            label="Role"
            placeholder="Select a role"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
            ]}
          />
          <Checkbox label="I agree to the terms" defaultChecked />
          <Switch label="Notifications" defaultChecked />
        </Card>

        <Alert variant="success" title="Ready">
          Tokens, components, and styles.css are wired up.
        </Alert>
      </div>
    </div>
  );
}
