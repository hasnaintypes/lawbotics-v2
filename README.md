# LawBotics v2

A sophisticated AI-powered legal contract analysis platform built with Next.js and advanced machine learning models. This platform leverages the Contract Understanding Atticus Dataset (CUAD) to provide intelligent contract review and clause extraction capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [AI Model Training](#ai-model-training)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

LawBotics v2 is an advanced legal technology platform that combines artificial intelligence with legal expertise to streamline contract review processes. The platform utilizes fine-tuned language models trained on the CUAD dataset to identify and extract key contract clauses, helping legal professionals save time and reduce errors in contract analysis.

## ✨ Features

### Core Functionality

- **AI-Powered Contract Analysis**: Automated clause identification and extraction from legal contracts
- **Multi-Format Support**: Process contracts in PDF and text formats
- **Real-time Analysis**: Instant contract review with immediate results
- **Clause Categorization**: Identify 41+ different types of legal clauses
- **Interactive UI**: Modern, responsive web interface built with Next.js 15

### AI & Machine Learning

- **Fine-tuned LLaMA Models**: Custom-trained models on legal contract data
- **CUAD Dataset Integration**: Leverages 13,000+ labeled contract examples
- **LangChain Integration**: Advanced AI orchestration and processing
- **Google GenAI Support**: Integration with Google's generative AI models

### User Experience

- **Authentication**: Secure user management with Clerk
- **Dark/Light Mode**: Customizable theme support
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Notifications**: Toast notifications and progress tracking
- **PDF Viewer**: Built-in PDF document viewer and processor

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   AI Processing │    │   Data Storage  │
│   (Next.js 15)  │◄──►│   (Python/ML)   │◄──►│   (Convex DB)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Authentication │    │  Model Training │    │ Contract Storage│
│     (Clerk)     │    │   (Jupyter)     │    │    (Files)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Git**
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/hasnaintypes/lawbotics-v2.git
   cd lawbotics-v2
   ```

2. **Install dependencies**

   ```bash
   # Install web UI dependencies
   cd apps/web-ui
   npm install

   # Return to root
   cd ../..
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment template
   cp apps/web-ui/.env.example apps/web-ui/.env.local
   ```

4. **Configure environment variables**
   Edit `apps/web-ui/.env.local` with your keys:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Convex Database
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

   # Other services
   SVIX_SECRET=your_svix_secret
   ```

5. **Start the development server**

   ```bash
   cd apps/web-ui
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 Usage

### Web Interface

1. **Sign Up/Login**: Create an account or log in using the Clerk authentication system
2. **Upload Contract**: Upload a PDF or text file containing the legal contract
3. **AI Analysis**: The system will automatically process the contract and identify key clauses
4. **Review Results**: Examine the extracted clauses and their categorizations
5. **Export/Save**: Save results or export analysis reports

### Contract Analysis Features

- **Clause Detection**: Automatically identifies 41+ types of legal clauses
- **Risk Assessment**: Highlights potentially problematic clauses
- **Comparison**: Compare multiple contracts side by side
- **Search**: Full-text search within contracts and extracted clauses

## 🧠 AI Model Training

The project includes comprehensive AI model training capabilities using the CUAD dataset.

### Dataset Information

- **CUAD v1**: 13,000+ labeled examples across 510 commercial contracts
- **41 Clause Categories**: Comprehensive coverage of legal contract elements
- **Multiple Formats**: CSV, JSON, Excel, PDF, and TXT formats available

### Training Process

1. **Navigate to AI model directory**

   ```bash
   cd ai-model
   ```

2. **Open Jupyter Notebook**

   ```bash
   jupyter notebook Fine_tuning_code.ipynb
   ```

3. **Follow the training steps**:
   - Data preparation and preprocessing
   - Model fine-tuning with LLaMA architecture
   - Evaluation and validation
   - Model export and deployment

### Supported Models

- **LLaMA 3.2**: Primary model for instruction tuning
- **Google GenAI**: Integration for additional AI capabilities
- **Custom Fine-tuned Models**: Specialized legal contract models

## 📁 Project Structure

```
lawbotics-v2/
├── 📁 ai-model/                    # AI/ML model training and data
│   ├── 📄 Fine_tuning_code.ipynb   # Jupyter notebook for model training
│   └── 📁 data-set/                # CUAD dataset and training data
│       ├── 📄 CUAD_v1.json         # Main dataset file
│       ├── 📄 master_clauses.csv   # Clause categorization data
│       ├── 📁 full_contract_pdf/   # Original contract PDFs
│       ├── 📁 full_contract_txt/   # Text versions of contracts
│       └── 📁 label_group_xlsx/    # Excel files with labeled data
├── 📁 apps/                        # Application modules
│   ├── 📁 dashboard/               # Admin dashboard (planned)
│   └── 📁 web-ui/                  # Main web application
│       ├── 📄 package.json         # Dependencies and scripts
│       ├── 📄 next.config.ts       # Next.js configuration
│       ├── 📄 tailwind.config.js   # Tailwind CSS configuration
│       ├── 📄 middleware.ts        # Authentication middleware
│       ├── 📁 src/                 # Source code
│       │   ├── 📁 app/             # Next.js app router pages
│       │   ├── 📁 components/      # Reusable UI components
│       │   ├── 📁 lib/             # Utility functions and configs
│       │   ├── 📁 hooks/           # Custom React hooks
│       │   ├── 📁 services/        # API and external service integrations
│       │   ├── 📁 store/           # State management (Zustand)
│       │   └── 📁 convex/          # Convex database functions
│       └── 📁 public/              # Static assets
└── 📁 docs/                        # Documentation (planned)
```

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Modern utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

### Backend & Services

- **Convex**: Real-time database and backend
- **Clerk**: Authentication and user management
- **SVIX**: Webhook management
- **Axios**: HTTP client for API requests

### AI & Machine Learning

- **LangChain**: AI application framework
- **Google Generative AI**: AI model integration
- **Python**: Model training and processing
- **Jupyter**: Interactive development environment

### State Management & Utils

- **Zustand**: Lightweight state management
- **React PDF**: PDF processing and viewing
- **Recharts**: Data visualization
- **Sonner**: Toast notifications

## 👩‍💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Style

- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (recommended)

### Development Guidelines

1. **Component Structure**: Use functional components with TypeScript
2. **State Management**: Utilize Zustand for global state
3. **Styling**: Implement Tailwind CSS classes with component variants
4. **API Integration**: Use services directory for external API calls
5. **Error Handling**: Implement comprehensive error boundaries

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### Contract Analysis Endpoints

- `POST /api/contracts/upload` - Upload contract for analysis
- `GET /api/contracts/:id` - Retrieve contract analysis
- `POST /api/contracts/analyze` - Perform AI analysis
- `GET /api/contracts/history` - User's contract history

### AI Model Endpoints

- `POST /api/ai/extract-clauses` - Extract clauses from contract
- `POST /api/ai/classify` - Classify contract clauses
- `GET /api/ai/models` - Available AI models

## 🤝 Contributing

We welcome contributions to LawBotics v2! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

### Contribution Guidelines

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Provide clear commit messages and PR descriptions

### Issues and Bug Reports

Please use the GitHub issue tracker to report bugs or request features. Include:

- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Atticus Project**: For providing the CUAD dataset
- **Next.js Team**: For the excellent React framework
- **Clerk**: For seamless authentication solutions
- **Radix UI**: For accessible component primitives
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

For support and questions:

- 📧 Email: support@lawbotics.com
- 💬 Discord: [LawBotics Community](https://discord.gg/lawbotics)
- 📖 Documentation: [docs.lawbotics.com](https://docs.lawbotics.com)
- 🐛 Issues: [GitHub Issues](https://github.com/hasnaintypes/lawbotics-v2/issues)

---

**Built with ❤️ by the LawBotics Team**

_Empowering legal professionals with AI-driven contract analysis_
