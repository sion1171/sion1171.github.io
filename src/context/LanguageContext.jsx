import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const translations = {
  en: {
    nav: {
      about: 'About',
      publications: 'Publications',
      resume: 'Resume',
      contact: 'Contact'
    },
    hero: {
      name: "Hi 👋, I'm Sion",
      title: 'AI/Data Scientist @ Tridge'
    },
    about: {
      title: 'About Me',
      greeting: '',
      intro: "I'm an AI/Data Scientist at Tridge, a unicorn startup revolutionizing global agricultural trade. I build NLP solutions that turn vast trading data into actionable insights. Currently on a gap year from Michigan State University, where I study Data Science.",
      example: '',
      skills: 'Skills',
      skillsList: ['Python', 'LLM/RAG', 'NLP', 'LangChain', 'Vector DB', 'Django', 'React', 'AWS', 'Snowflake', 'SQL', 'Git']
    },
    publications: {
      title: 'Publications & Projects',
      view: 'View →',
      items: [
        {
          id: 4,
          title: 'Tridge Eye: My Curation - AI Market Intelligence Chatbot',
          description: 'Built the AI chatbot and algorithms for "My Curation," a feature that instantly translates a single question into a hyper-personalized market radar — from questions to clear export strategies in one click for the global agrifood industry.',
          tags: ['LLM/RAG', 'LangChain', 'NLP', 'Vector DB', 'Python'],
          website: 'https://www.tridge.com/',
          projectPage: 'my-curation',
          year: '2026'
        },
        {
          id: 5,
          title: 'RAG-Based Food Product Classifier',
          description: 'Built a RAG-powered classification system that maps raw trade transaction inputs to Tridge\'s food product ontology using vector search, achieving 99.7% cost reduction with 45% accuracy improvement.',
          tags: ['RAG', 'Vector DB', 'LangChain', 'NLP', 'Python'],
          website: 'https://www.tridge.com/',
          projectPage: 'food-classifier',
          year: '2025'
        },
        {
          id: 1,
          title: 'Designing and Evaluating Multi-Chatbot Interface for Human-AI Communication',
          description: 'Explores multi-chatbot interfaces for persuasion tasks, developing an online environment with GPT-based chatbots to examine dynamics of human-AI group communication.',
          tags: ['Human-AI Interaction', 'NLP', 'Chatbot'],
          paper: 'https://arxiv.org/abs/2406.19648',
          github: 'https://github.com/sion1171/multi_chatbot_interaction',
          year: '2024'
        },
        {
          id: 2,
          title: 'Panorama Image Stitching for Maritime Situational Awareness',
          description: 'Developed real-time panorama stitching algorithm for autonomous ships using OpenCV and YOLO.',
          tags: ['Computer Vision', 'OpenCV', 'YOLO'],
          projectPage: 'panorama',
          year: '2024'
        },
        {
          id: 3,
          title: 'Pyeon Lab Website',
          description: 'Led a team of 5 as PM & full-stack developer to rebuild the lab website. Migrated from WordPress to Django.',
          tags: ['Django', 'Full-stack', 'Project Management'],
          website: 'https://pyeonlab.org',
          year: '2024'
        }
      ]
    },
    projects: {
      'my-curation': {
        title: 'Tridge Eye: My Curation - AI Market Intelligence Chatbot',
        year: '2026',
        tags: ['LLM/RAG', 'LangChain', 'NLP', 'Vector DB', 'Python'],
        description: [
          'Built the AI chatbot and core algorithms for "My Curation," a key feature of Tridge Eye — a market intelligence platform for the global agrifood industry.',
          'My Curation instantly translates a single business question into a hyper-personalized market radar, delivering clear export strategies in one click.',
          'Developed the RAG pipeline and conversational AI that surfaces contextual supply chain insights, moving beyond misleading aggregate data to provide intelligence mapped exactly to each user\'s business context.'
        ],
        images: [
          '/projects/my-curation/1.jpeg',
          '/projects/my-curation/2.jpeg',
          '/projects/my-curation/3.jpeg',
          '/projects/my-curation/4.jpeg'
        ],
        youtube: 'https://www.youtube.com/watch?v=wFg5wKJhR_0'
      },
      'food-classifier': {
        title: 'RAG-Based Food Product Classifier',
        year: '2025',
        tags: ['RAG', 'Vector DB', 'LangChain', 'NLP', 'Python'],
        description: [
          'Built a RAG-powered classification system at Tridge that automatically maps raw trade transaction inputs to the correct food product category within Tridge\'s proprietary ontology.',
          'When raw trade data comes in, the system uses RAG vector search to find the most relevant product category from Tridge\'s extensive food product taxonomy, eliminating the need for manual classification.',
          'Achieved a 99.7% cost reduction compared to the previous approach while simultaneously improving classification accuracy by 45%.'
        ],
        youtube: 'https://www.youtube.com/watch?v=LvEkX4xCy5Q'
      },
      panorama: {
        title: 'Panorama Image Stitching for Maritime Situational Awareness',
        year: '2024',
        tags: ['Computer Vision', 'OpenCV', 'YOLO', 'Python', 'ROS'],
        description: [
          'Developed a real-time panorama stitching and blending algorithm for autonomous ships as a research intern at Keimyung University.',
          'The project was fully funded by Korea Research Institute of Ships & Ocean Engineering (KRISO) and aimed to enhance maritime situational awareness by creating seamless 360-degree views from multiple camera feeds.',
          'Implemented feature detection, image warping, and blending techniques using OpenCV. Integrated YOLO 9 for object detection to identify vessels and obstacles in the stitched panorama.',
          'The system was designed to work in real-time within ROS (Robot Operating System) environment for autonomous ship navigation.'
        ],
        youtube: 'https://www.youtube.com/watch?v=uL4adLGIFfU&t=3s'
      }
    },
    resume: {
      title: 'Resume',
      download: 'Download PDF',
      education: 'Education',
      experience: 'Experience',
      eduItems: [
        {
          id: 1,
          degree: 'B.S. in Data Science, Minor in Mathematics',
          school: 'Michigan State University',
          period: '2021 - Present',
          description: "Engineering Dean's List • Currently on gap year"
        }
      ],
      expItems: [
        {
          id: 1,
          title: 'AI/Data Scientist',
          company: 'Tridge',
          logo: '/logos/tridge.png',
          period: 'Jan 2025 - Present',
          description: 'Built RAG-based food product classifier (99.7% cost reduction, 45% accuracy gain). Developed AI chatbot & core algorithms for Tridge Eye "My Curation" — a market intelligence platform turning questions into personalized trade insights.'
        },
        {
          id: 2,
          title: 'Research Intern',
          company: 'Keimyung University',
          logo: '/logos/keimyung.png',
          period: 'May 2024 - Aug 2024',
          description: 'Developed panorama stitching algorithm for autonomous ships. Funded by KRISO.'
        },
        {
          id: 3,
          title: 'Project Manager & Full-stack Developer',
          company: 'Michigan State University (Pyeon Lab)',
          logo: '/logos/msu.png',
          period: 'Jan 2024 - Aug 2024',
          description: 'Led team of 5 to rebuild pyeonlab.org. Full-stack development with Django.',
          link: 'https://pyeonlab.org'
        },
        {
          id: 4,
          title: 'Software Developer & Research Assistant',
          company: 'Michigan State University',
          logo: '/logos/msu.png',
          period: 'Sep 2023 - Aug 2024',
          description: 'Built multi-chatbot survey platform using Django, MySQL, AWS, and ChatGPT API.'
        },
        {
          id: 5,
          title: 'Student Research Assistant',
          company: 'Facility for Rare Isotope Beams (FRIB)',
          logo: '/logos/frib.png',
          period: 'Aug 2023 - May 2024',
          description: 'Developed emissivity measurement device and analyzed thermal-structural data for beam dump systems.'
        }
      ],
      leadership: 'Leadership',
      leadershipItems: [
        {
          id: 1,
          title: 'President',
          company: 'LIKELION MSU',
          logo: '/logos/likelion.png',
          period: 'Jun 2023 - May 2024',
          description: 'Led Korean coding education org. Instructed web development and managed 9 hackathon projects.'
        }
      ]
    },
    contact: {
      title: 'Contact',
      intro: 'Feel free to reach out!'
    },
    github: {
      title: 'GitHub Activity',
      totalCount: '{{count}} contributions in 2026'
    },
    footer: {
      copyright: '© 2024 Sion Yoon. All rights reserved.'
    }
  },
  ko: {
    nav: {
      about: '소개',
      publications: '연구/프로젝트',
      resume: '이력',
      contact: '연락처'
    },
    hero: {
      name: '안녕하세요 👋 윤시온입니다',
      title: 'AI/Data Scientist @ Tridge'
    },
    about: {
      title: '소개',
      greeting: '',
      intro: '글로벌 농산물 무역을 혁신하는 유니콘 스타트업 Tridge에서 AI/Data Scientist로 일하고 있습니다. 방대한 거래 데이터를 인사이트로 전환하는 NLP 솔루션을 개발하고 있으며, 현재 Michigan State University에서 Data Science를 전공하며 갭이어 중입니다.',
      example: '',
      skills: 'Skills',
      skillsList: ['Python', 'LLM/RAG', 'NLP', 'LangChain', 'Vector DB', 'Django', 'React', 'AWS', 'Snowflake', 'SQL', 'Git']
    },
    publications: {
      title: '연구 및 프로젝트',
      view: '보기 →',
      items: [
        {
          id: 4,
          title: 'Tridge Eye: My Curation - AI 시장 인텔리전스 챗봇',
          description: '하나의 질문을 초개인화된 마켓 레이더로 즉시 변환하는 "My Curation" 기능의 AI 챗봇 및 핵심 알고리즘 개발. 글로벌 농식품 산업의 수출 전략을 원클릭으로 제공.',
          tags: ['LLM/RAG', 'LangChain', 'NLP', 'Vector DB', 'Python'],
          website: 'https://www.tridge.com/',
          projectPage: 'my-curation',
          year: '2026'
        },
        {
          id: 5,
          title: 'RAG 기반 식품 분류기',
          description: '무역 거래건의 원본 입력값을 RAG 벡터 검색을 활용하여 트릿지 식품 온톨로지에 매핑하는 분류 시스템 구축. 비용 99.7% 절감, 정확도 45% 향상 달성.',
          tags: ['RAG', 'Vector DB', 'LangChain', 'NLP', 'Python'],
          website: 'https://www.tridge.com/',
          projectPage: 'food-classifier',
          year: '2025'
        },
        {
          id: 1,
          title: '멀티 챗봇 인터페이스 설계 및 평가: 인간-AI 커뮤니케이션 연구',
          description: '설득 과제를 위한 멀티 챗봇 인터페이스 연구. GPT 기반 챗봇을 활용한 온라인 환경에서 인간-AI 그룹 커뮤니케이션의 역학을 분석.',
          tags: ['Human-AI Interaction', 'NLP', 'Chatbot'],
          paper: 'https://arxiv.org/abs/2406.19648',
          github: 'https://github.com/sion1171/multi_chatbot_interaction',
          year: '2024'
        },
        {
          id: 2,
          title: '해양 상황 인식을 위한 파노라마 이미지 스티칭',
          description: 'OpenCV와 YOLO를 활용한 자율운항 선박용 실시간 파노라마 스티칭 알고리즘 개발.',
          tags: ['Computer Vision', 'OpenCV', 'YOLO'],
          projectPage: 'panorama',
          year: '2024'
        },
        {
          id: 3,
          title: 'Pyeon Lab 웹사이트',
          description: 'PM 및 풀스택 개발자로 5인 팀을 이끌어 연구실 웹사이트 재구축. WordPress에서 Django로 마이그레이션.',
          tags: ['Django', 'Full-stack', 'Project Management'],
          website: 'https://pyeonlab.org',
          year: '2024'
        }
      ]
    },
    projects: {
      'my-curation': {
        title: 'Tridge Eye: My Curation - AI 시장 인텔리전스 챗봇',
        year: '2026',
        tags: ['LLM/RAG', 'LangChain', 'NLP', 'Vector DB', 'Python'],
        description: [
          '글로벌 농식품 산업을 위한 시장 인텔리전스 플랫폼 Tridge Eye의 핵심 기능 "My Curation"의 AI 챗봇 및 핵심 알고리즘을 개발했습니다.',
          'My Curation은 하나의 비즈니스 질문을 초개인화된 마켓 레이더로 즉시 변환하여, 원클릭으로 명확한 수출 전략을 제공합니다.',
          'RAG 파이프라인과 대화형 AI를 개발하여 오해를 불러일으키는 집계 데이터를 넘어, 각 사용자의 비즈니스 맥락에 맞는 공급망 인사이트를 제공합니다.'
        ],
        images: [
          '/projects/my-curation/1.jpeg',
          '/projects/my-curation/2.jpeg',
          '/projects/my-curation/3.jpeg',
          '/projects/my-curation/4.jpeg'
        ],
        youtube: 'https://www.youtube.com/watch?v=wFg5wKJhR_0'
      },
      'food-classifier': {
        title: 'RAG 기반 식품 분류기',
        year: '2025',
        tags: ['RAG', 'Vector DB', 'LangChain', 'NLP', 'Python'],
        description: [
          '트릿지에서 무역 거래건의 원본 입력값을 트릿지의 자체 식품 온톨로지 내 올바른 품목군으로 자동 매핑하는 RAG 기반 분류 시스템을 구축했습니다.',
          '원본 거래 데이터가 들어오면 RAG 벡터 검색을 통해 트릿지의 방대한 식품 분류 체계에서 가장 적합한 품목 카테고리를 찾아내어 수동 분류의 필요성을 제거했습니다.',
          '기존 방식 대비 비용 99.7% 절감과 동시에 분류 정확도 45% 향상을 달성했습니다.'
        ],
        youtube: 'https://www.youtube.com/watch?v=LvEkX4xCy5Q'
      },
      panorama: {
        title: '해양 상황 인식을 위한 파노라마 이미지 스티칭',
        year: '2024',
        tags: ['Computer Vision', 'OpenCV', 'YOLO', 'Python', 'ROS'],
        description: [
          '계명대학교 연구 인턴으로서 자율운항 선박을 위한 실시간 파노라마 스티칭 및 블렌딩 알고리즘을 개발했습니다.',
          '이 프로젝트는 한국해양과학기술원(KRISO)의 전액 지원을 받았으며, 여러 카메라 피드에서 매끄러운 360도 뷰를 생성하여 해양 상황 인식을 향상시키는 것을 목표로 했습니다.',
          'OpenCV를 사용하여 특징 검출, 이미지 워핑 및 블렌딩 기법을 구현했습니다. YOLO 9를 통합하여 스티칭된 파노라마에서 선박과 장애물을 식별했습니다.',
          '시스템은 자율운항 선박 내비게이션을 위해 ROS(Robot Operating System) 환경에서 실시간으로 작동하도록 설계되었습니다.'
        ],
        youtube: 'https://www.youtube.com/watch?v=uL4adLGIFfU&t=3s'
      }
    },
    resume: {
      title: '이력',
      download: 'PDF 다운로드',
      education: '학력',
      experience: '경력',
      eduItems: [
        {
          id: 1,
          degree: 'B.S. in Data Science, 수학 부전공',
          school: 'Michigan State University',
          period: '2021 - 현재',
          description: "Engineering Dean's List • 현재 갭이어 중"
        }
      ],
      expItems: [
        {
          id: 1,
          title: 'AI/Data Scientist',
          company: 'Tridge',
          logo: '/logos/tridge.png',
          period: '2025.01 - 현재',
          description: 'RAG 기반 식품 분류기 구축 (비용 99.7% 절감, 정확도 45% 향상). Tridge Eye "My Curation"의 AI 챗봇 및 핵심 알고리즘 개발 — 질문 하나로 초개인화된 시장 인사이트를 제공하는 마켓 인텔리전스 플랫폼.'
        },
        {
          id: 2,
          title: '연구 인턴',
          company: '계명대학교',
          logo: '/logos/keimyung.png',
          period: '2024.05 - 2024.08',
          description: '자율운항 선박용 파노라마 스티칭 알고리즘 개발. KRISO 지원 연구.'
        },
        {
          id: 3,
          title: '프로젝트 매니저 & 풀스택 개발자',
          company: 'Michigan State University (Pyeon Lab)',
          logo: '/logos/msu.png',
          period: '2024.01 - 2024.08',
          description: '5인 팀을 이끌어 pyeonlab.org 재구축. Django로 풀스택 개발.',
          link: 'https://pyeonlab.org'
        },
        {
          id: 4,
          title: '소프트웨어 개발자 & 연구 조교',
          company: 'Michigan State University',
          logo: '/logos/msu.png',
          period: '2023.09 - 2024.08',
          description: 'Django, MySQL, AWS, ChatGPT API를 활용한 멀티챗봇 설문 플랫폼 구축.'
        },
        {
          id: 5,
          title: '학부 연구 조교',
          company: 'Facility for Rare Isotope Beams (FRIB)',
          logo: '/logos/frib.png',
          period: '2023.08 - 2024.05',
          description: '방사율 측정 장치 개발 및 빔 덤프 시스템의 열-구조 데이터 분석.'
        }
      ],
      leadership: 'Leadership',
      leadershipItems: [
        {
          id: 1,
          title: '회장',
          company: 'LIKELION MSU',
          logo: '/logos/likelion.png',
          period: '2023.06 - 2024.05',
          description: '코딩 교육 단체 운영. 웹 개발 교육 및 9개 해커톤 프로젝트 관리.'
        }
      ]
    },
    contact: {
      title: '연락처',
      intro: '궁금한 점이 있으시면 연락해 주세요!'
    },
    github: {
      title: 'GitHub 활동',
      totalCount: '2026년 {{count}}개의 기여'
    },
    footer: {
      copyright: '© 2024 윤시온. All rights reserved.'
    }
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
