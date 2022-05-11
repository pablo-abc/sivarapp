import { toast } from './toast';

export function getCurrentInstance() {
  const currentInstance = localStorage.getItem('currentInstance');
  if (!currentInstance) {
    toast('Operation failed', {
      variant: 'danger',
      icon: 'x-circle',
    });
    return;
  }
  return currentInstance;
}
