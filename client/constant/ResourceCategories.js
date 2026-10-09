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
      description: 'Public benefits, financial literacy, housing and rental assistance',
      icon: DollarSign,
      color: Colors.SECONDARY,
      count: '30+ resources',
            // Demo data until resources come from the backend.
      // provider: 'csula' or 'other'. action: which detail the main button uses ('call' or 'website').
      resources: [
        {
          id: 'csula-financial-aid',
          title: 'Help paying for college',
          name: 'Cal State LA Center for Student Financial Aid and Scholarships',
          description: 'Help with the FAFSA, the California Dream Act Application, grants, and scholarships.',
          provider: 'csula',
          location: 'Student Services Building, Room 2330',
          phone: '(323) 343-6260',
          website: 'https://www.calstatela.edu/financialaid',
          action: 'website',
        },
        {
          id: 'csula-emergency-grants',
          title: 'Emergency money for students in a crisis',
          name: 'Cal State LA Emergency Grants',
          description: 'Grants for students facing an unexpected financial emergency, including help with housing.',
          provider: 'csula',
          location: 'Office of the Dean of Students',
          phone: '(323) 343-3000',
          website: 'https://www.calstatela.edu/deanofstudents/emergency-financial-and-housing-assistance',
          action: 'website',
        },
        {
          id: 'benefitscal',
          title: 'Help paying for groceries, health care, and bills',
          name: 'BenefitsCal (CalFresh, Medi-Cal, CalWORKs)',
          description: 'Apply online for California food, health, and cash aid programs, or apply by phone with LA County.',
          provider: 'other',
          location: 'Online or by phone',
          phone: '(866) 613-3777',
          website: 'https://benefitscal.com',
          action: 'website',
        },
        {
          id: 'csula-vita',
          title: 'Free help filing your taxes',
          name: 'Cal State LA VITA Program',
          description: 'Free tax return preparation for families and students, on Saturday mornings during tax season (February to April).',
          provider: 'csula',
          location: 'Salazar Hall, Room 358, and nearby libraries',
          phone: '',
          website: 'https://www.calstatela.edu/programs/vita',
          action: 'website',
        },
        {
          id: '211-la',
          title: 'Find help with rent, bills, and food',
          name: '211 LA',
          description: 'Free help line that connects you to local services. Open 24/7, in many languages.',
          provider: 'other',
          location: 'By phone or online',
          phone: '211',
          website: 'https://www.211la.org',
          action: 'call',
        },
      ],
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