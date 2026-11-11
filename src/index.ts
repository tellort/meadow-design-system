// Meadow design system: public API. Import everything from here.
import './styles/index.css';

export { MeadowProvider, useMeadow, type Vibe, type MeadowProviderProps } from './components/MeadowProvider';
export { Icon, Art, iconTints, type IconProps, type ArtProps } from './icons/Icon';
export { ICON_NAMES, type IconName, type ArtName, type Tint } from './icons/data';
export { feedback, type FeedbackEvent } from './lib/feedback';

export { Button, IconButton, Fab, Link, type ButtonProps, type IconButtonProps, type FabProps } from './components/Actions';
export {
  Toggle, Checkbox, Radio, Slider, TextField, TextArea, Select, SearchField, Segmented, Tabs, FilterChip, Stepper,
  type ToggleProps, type SliderProps, type TextFieldProps, type TextAreaProps, type SelectProps, type SegmentedProps, type TabsProps, type FilterChipProps, type StepperProps,
} from './components/Controls';
export {
  GlassCard, StatCard, List, ListRow, Sheet, ConfirmDialog, Menu, MenuButton, Accordion, Drawer,
  type GlassCardProps, type StatCardProps, type ListProps, type ListRowProps, type SheetProps, type ConfirmDialogProps, type MenuItem, type DrawerProps,
} from './components/Surfaces';
export {
  Chip, Badge, Banner, Progress, Skeleton, Spinner, EmptyState, Tooltip, ToastProvider, useToast,
  type ChipProps, type BannerProps, type ProgressProps, type EmptyStateProps, type TooltipProps, type StatusKind,
} from './components/Feedback';
export {
  TabBar, TopBar, BackButton, Breadcrumbs, Pagination, StepIndicator,
  type TabBarProps, type TabBarItem, type TopBarProps, type Crumb, type PaginationProps,
} from './components/Navigation';
export {
  Avatar, AvatarGroup, Table, Divider, Chat, ChatBubble, TypingIndicator, Timeline, Sparkline, BarChart,
  type ChatBubbleProps, type TableColumn, type TimelineItem, type BarDatum,
} from './components/Data';
export { Screen } from './components/Layout';
