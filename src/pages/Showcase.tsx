import { useState } from 'react';
import {
  Accordion, Banner, Button, Checkbox, Chip, ConfirmDialog, EmptyState, FilterChip, GlassCard, List, ListRow, MenuButton, Progress, Radio,
  Screen, SearchField, Segmented, Sheet, Slider, Sparkline, StatCard, TabBar, TextField, Toggle, useMeadow, useToast, BarChart, ChatBubble, Chat, TypingIndicator, Divider, Avatar, Badge, Icon, type Vibe,
} from '../index';

/** Showcase page used to check the library. Not part of the public API. */
export default function Showcase() {
  const { vibe, setVibe } = useMeadow();
  const toast = useToast();
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day');
  const [tab, setTab] = useState<'home' | 'chart' | 'user'>('home');
  const [on, setOn] = useState(true);
  const [vol, setVol] = useState(60);
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [filter, setFilter] = useState(true);
  return (
    <Screen bottomSpace>
      <Screen.Grid>
        <div className="m-span">
          <Segmented<Vibe> label="Vibe" value={vibe} onChange={setVibe} options={[{ value: 'personal', label: 'Personal' }, { value: 'clean', label: 'Clean' }]} />
        </div>
        <StatCard label="Slept last night" value="7h 42m" delta="24 min more than average"><Sparkline values={[4, 6, 5, 7, 6, 8, 7]} label="Sleep trend over the last week" /></StatCard>
        <GlassCard>
          <p className="m-eyebrow">Slept this week</p>
          <BarChart description="Hours of sleep per day, best on Saturday with 8.1 hours" data={[{ label: 'M', value: 6 }, { label: 'T', value: 7 }, { label: 'W', value: 5.5 }, { label: 'T', value: 7.2 }, { label: 'F', value: 6.6 }, { label: 'S', value: 8.1, highlight: true }, { label: 'S', value: 7.4 }]} />
        </GlassCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Segmented label="Range" value={range} onChange={setRange} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
          <List>
            <ListRow icon="moon" title="Wind down" subtitle="Starts 22:30" trailing={<Toggle label="Wind down" checked={on} onCheckedChange={setOn} />} />
            <ListRow icon="bulb" title="Wake-up light" subtitle="06:45" trailing={<Toggle label="Wake-up light" defaultChecked={false} />} />
            <ListRow icon="bell" title="Reminders" subtitle="Weekdays" onClick={() => setSheet(true)} trailing={<Icon name="chevron-right" size={20} />} />
          </List>
        </div>
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField label="Routine name" placeholder="Evening wind-down" hint="Shown on your home screen." />
          <TextField label="Email" defaultValue="name@home" error="Add a domain, like name@home.com" />
          <SearchField aria-label="Search routines" placeholder="Search routines" />
          <Checkbox label="Remind me before bed" defaultChecked />
          <Radio name="r" label="Every night" defaultChecked />
          <Radio name="r" label="Weekdays" />
          <Slider label="Brightness" value={vol} onChange={setVol} />
        </GlassCard>
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Banner kind="warning">Your battery is low. Charge it before bed.</Banner>
          <Progress value={72} label="Upload progress" />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip kind="success" icon="check-circle">On track</Chip>
            <Chip kind="danger" icon="alert">Offline</Chip>
            <FilterChip pressed={filter} onPressedChange={setFilter}>Sleep</FilterChip>
            <Avatar name="Oscar S" />
            <span style={{ position: 'relative', display: 'inline-flex' }}><Icon name="bell" size={24} /><span style={{ position: 'absolute', top: -8, right: -12 }}><Badge count={3} /></span></span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button onClick={() => toast('Routine saved', { actionLabel: 'Undo', kind: 'success' })}>Save routine</Button>
            <Button variant="glass" onClick={() => setSheet(true)}>Open sheet</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>Delete</Button>
            <MenuButton items={[{ label: 'Edit routine', icon: 'edit', onSelect: () => {} }, { label: 'Share', icon: 'share', onSelect: () => {} }, { label: 'Delete', icon: 'trash', danger: true, onSelect: () => {} }]} />
          </div>
        </GlassCard>
        <GlassCard>
          <Chat>
            <ChatBubble from="them" time="08:12">How did you sleep?</ChatBubble>
            <ChatBubble from="me" time="08:13">Better than last week.</ChatBubble>
            <TypingIndicator />
          </Chat>
          <Divider label="or" />
          <Accordion defaultOpenIndex={0} items={[{ title: 'How does wind-down work?', content: 'Lights dim and notifications mute 30 minutes before bedtime.' }, { title: 'Can I change the time?', content: 'Yes, open the routine.' }]} />
        </GlassCard>
        <GlassCard><EmptyState art="sprout" title="Nothing planned tonight" description="Add a wind-down and your lights will dim on their own." actionLabel="Add wind-down" /></GlassCard>
      </Screen.Grid>
      <TabBar value={tab} onChange={setTab} items={[{ id: 'home', icon: 'home', label: 'Home' }, { id: 'chart', icon: 'chart', label: 'Insights' }, { id: 'user', icon: 'user', label: 'You' }]} />
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Wind down"><p className="m-sub" style={{ marginBottom: 20 }}>Dims lights and mutes notifications at 22:30.</p><Button block onClick={() => setSheet(false)}>Start now</Button></Sheet>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => toast('Routine deleted')} title="Delete this routine?" message="Wind down will stop running. You can't undo this." confirmLabel="Delete" cancelLabel="Keep it" destructive />
    </Screen>
  );
}
