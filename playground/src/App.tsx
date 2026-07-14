import { useState } from 'react';
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
  LoadBoundary,
  Radio,
  RadioGroup,
  SegmentedTab,
  SegmentedTabs,
  Select,
  StatusBadge,
  Switch,
  Text,
  Textarea,
} from '@codearemo/instollar-sdk';

export function App() {
  const [role, setRole] = useState('installer');
  const [skills, setSkills] = useState<string[]>(['wiring']);
  const [tab, setTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <Text variant="spline-bold-h4">Instollar SDK</Text>
          <Text variant="open-regular-p">Barebones design-system playground.</Text>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button prefix={<Icon icon={Home2} size="sm" />}>Continue</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost" tone="destructive">
            Ghost danger
          </Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="danger">Danger</Button>
          <Badge>New</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Chip selected prefix={<Icon icon={Home2} size="xs" />}>
            Filter
          </Chip>
        </div>

        <SegmentedTabs value={tab} onValueChange={setTab} accent="primary">
          <SegmentedTab value="overview">Overview</SegmentedTab>
          <SegmentedTab value="jobs" badge={3}>
            Jobs
          </SegmentedTab>
          <SegmentedTab value="settings">Settings</SegmentedTab>
        </SegmentedTabs>

        <Card className="flex flex-col gap-4">
          <Input label="Email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Input label="Amount" type="number" placeholder="1,000" />
          <Textarea label="Notes" placeholder="Optional notes" />
          <Select
            label="Role"
            placeholder="Select a role"
            searchable
            value={role}
            onValueChange={(value) => setRole(value as string)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
              { value: 'supervisor', label: 'Supervisor' },
              { value: 'crew-lead', label: 'Crew lead' },
            ]}
          />
          <Select
            label="Skills"
            placeholder="Select skills"
            multiple
            searchable
            value={skills}
            onValueChange={(value) => setSkills(value as string[])}
            options={[
              { value: 'wiring', label: 'Wiring' },
              { value: 'roofing', label: 'Roofing' },
              { value: 'inverters', label: 'Inverters' },
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="success" label="Active" />
            <StatusBadge tone="destructive" label="Failed" />
            <StatusBadge tone="neutral" label="Draft" />
          </div>
          <Checkbox label="I agree to the terms" description="Required to continue" defaultChecked />
          <RadioGroup label="Plan" defaultValue="pro" description="Pick a billing plan">
            <Radio value="starter" label="Starter" />
            <Radio value="pro" label="Pro" description="Most popular" />
          </RadioGroup>
          <Switch label="Notifications" description="Email digests" defaultChecked />
        </Card>

        <Alert variant="success" title="Ready" onDismiss={() => undefined}>
          Tokens, components, and styles.css are wired up.
        </Alert>

        <LoadBoundary isLoading={false} minHeight={80}>
          <Text variant="open-regular-p" className="text-muted">
            LoadBoundary content shell.
          </Text>
        </LoadBoundary>
      </div>
    </div>
  );
}
