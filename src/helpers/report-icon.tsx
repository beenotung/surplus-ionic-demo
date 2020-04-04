import * as Surplus from 'surplus';Surplus;
import { showToast } from './lib';

function showReportMenu() {
  showToast({ message: 'mock action' });
}

export const ReportIcon = (props: { color?: string }) => {
  return (
    <ion-icon
      name="bug"
      color={props.color || 'dark'}
      size="small"
      onClick={e => {
        e.preventDefault();
        showReportMenu();
      }}
    />
  );
};
