import { Users, HeartHandshake, Heart, Briefcase, DollarSign } from 'lucide-react-native';
import { Colors } from './Colors';

export const resourceCategories = [
    {
      id: 'career',
      title: 'Career',
      description: 'Job search, career counseling and professional development',
      icon: Briefcase,
      color: '#3B82F6',
      count: '25+ services'
    },
    {
      id: 'social',
      title: 'Social',
      description: 'CSULA peer support, community engagement, and mentorship ',
      icon: Users,
      color: Colors.PRIMARY,
      count: '18+ programs'
    },
    {
      id: 'financial',
      title: 'Financial',
      description: 'public benefits, financial literacy, housing and rental assistance',
      icon: DollarSign,
      color: Colors.SECONDARY,
      count: '30+ resources'
    },
    {
      id: 'physical',
      title: 'Physical',
      description: 'Physical and behavioral health services, counseling and wellness programs',
      icon: Heart,
      color: Colors.ERROR,
      count: '15+ services'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Volunteer opportunities, civic engagement and support services',
      icon: HeartHandshake,
      color: Colors.SUCCESS,
      count: '15+ services'
    }
  ];