import DASHBOARD from '../pages/dashboard.jsx';
import CHATBOT from '../pages/chatbot.jsx';
import BROADCAST from '../pages/broadcast.jsx';
import LEADS from '../pages/leads.jsx';
import SETTINGS from '../pages/settings.jsx';
import AUTOMATION from '../pages/automation.jsx';
import INTEGRATION from '../pages/integration.jsx';
export const routers = [{
  id: "dashboard",
  component: DASHBOARD
}, {
  id: "chatbot",
  component: CHATBOT
}, {
  id: "broadcast",
  component: BROADCAST
}, {
  id: "leads",
  component: LEADS
}, {
  id: "settings",
  component: SETTINGS
}, {
  id: "automation",
  component: AUTOMATION
}, {
  id: "integration",
  component: INTEGRATION
}]