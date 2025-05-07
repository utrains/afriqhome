# Property Listing Application for Africa

A comprehensive property listing platform designed specifically for the African real estate market.

## Features

- Property listings (residential, commercial, land)
- Advanced search and filtering
- User authentication and authorization
- Property management for sellers
- Location-based services
- Multi-language support

## Technology Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Search Engine: Elasticsearch
- Containerization: Docker
- Cloud Platform: AWS
- CI/CD: GitHub Actions

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- AWS Account
- MongoDB (local or Atlas)

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/property-listing.git
cd property-listing
```

2. Install dependencies:
```bash
npm install
cd frontend && npm install
```

3. Create environment files:
```bash
cp .env.example .env
```

4. Start the development environment:
```bash
docker-compose up
```

The application will be available at `http://localhost:5000`

## AWS Deployment

1. Create an EC2 instance:
   - Ubuntu Server 20.04 LTS
   - t2.micro (free tier) or larger
   - Security group with ports 22, 80, 443 open

2. Install Docker and Docker Compose on EC2:
```bash
sudo apt update
sudo apt install docker.io docker-compose
```

3. Configure domain in Route 53:
   - Create hosted zone for property.awscertif.site
   - Add A record pointing to EC2 instance

4. Deploy application:
```bash
# On your local machine
docker build -t property-listing .
docker tag property-listing:latest your-ec2-ip:latest
docker push your-ec2-ip:latest

# On EC2 instance
docker pull your-ec2-ip:latest
docker-compose up -d
```

## Development Phases

### Phase 1 (Current)
- Basic user authentication
- Simple property listing
- Basic search functionality
- Initial deployment

### Phase 2 (Next)
- Advanced search and filtering
- Image upload and management
- User profiles
- Basic messaging system

### Phase 3
- Map integration
- Multi-language support
- Advanced analytics
- Mobile responsiveness

### Phase 4
- Performance optimization
- Advanced security features
- Payment integration
- API documentation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 