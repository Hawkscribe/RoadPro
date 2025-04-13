import { useState, useEffect } from 'react';
import { MessageSquare, BarChart2, MapPin, Phone, Mail, Users, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoadCare() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveNavItem(sectionId);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Navbar */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="text-blue-600" size={24} />
            <span className="text-xl font-bold text-slate-800">RoadCare</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className={`transition hover:text-blue-600 ${activeNavItem === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className={`transition hover:text-blue-600 ${activeNavItem === 'features' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className={`transition hover:text-blue-600 ${activeNavItem === 'about' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`transition hover:text-blue-600 ${activeNavItem === 'contact' ? 'text-blue-600 font-semibold' : 'text-slate-700'}`}
            >
              Contact
            </button>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition transform hover:scale-105"
            onClick={() => navigate('/login')} // Redirect to login page
          >
            Log In
          </button>

        </div>
      </nav>
      
      {/* Hero Section */}
      <section 
        id="home" 
        className="pt-32 pb-20 px-6 relative"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div 
            className={`md:w-1/2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Making Roads <span className="text-blue-600">Better</span>, Together
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-lg">
              Our platform connects citizens and officials to efficiently track and resolve road infrastructure issues. Report problems and watch them get solved in real-time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center">
                <span>Report Issue</span>
                <ArrowRight className="ml-2" size={16} />
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full transition">
                View Dashboard
              </button>
            </div>
          </div>
          
          <div 
            className={`md:w-1/2 mt-12 md:mt-0 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-xl transform rotate-3 scale-105 opacity-10"></div>
              <div className="bg-white p-6 rounded-xl shadow-xl relative">
                <div className="flex justify-between mb-6">
                  <div className="text-slate-700 font-bold">Road Issue Tracking</div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MapPin className="text-blue-600" size={20} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-900">Pothole on Main Street</p>
                        <p className="text-xs text-slate-500">Status: In Progress</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <MapPin className="text-green-600" size={20} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-900">Streetlight Outage</p>
                        <p className="text-xs text-slate-500">Status: Resolved</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full rounded-full w-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <MapPin className="text-yellow-600" size={20} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-900">Traffic Signal Malfunction</p>
                        <p className="text-xs text-slate-500">Status: Pending Review</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-600 h-full rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">How RoadCare Works</h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">Our platform streamlines the process of reporting and resolving road infrastructure issues.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="text-blue-600" size={24} />,
                title: "Report Issues",
                description: "Citizens can easily submit infrastructure issues with location data and photos."
              },
              {
                icon: <BarChart2 className="text-blue-600" size={24} />,
                title: "Track Progress",
                description: "Follow the status of your reported issues from submission to resolution."
              },
              {
                icon: <Users className="text-blue-600" size={24} />,
                title: "Officer Dashboard",
                description: "Officials get real-time insights and analytics to prioritize repairs."
              },
              {
                icon: <FileText className="text-blue-600" size={24} />,
                title: "Transparency",
                description: "Public records of all reported issues and resolution timelines."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-50 p-6 rounded-xl hover:shadow-lg transition transform hover:-translate-y-1 hover:bg-blue-50"
              >
                <div className="bg-white p-3 rounded-full inline-block shadow-sm mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl transform -rotate-3 scale-105 opacity-10"></div>
                <div className="bg-white p-6 rounded-xl shadow-xl relative">
                  <img src="/api/placeholder/600/400" alt="Team working on road infrastructure" className="rounded-lg w-full" />
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">About RoadCare</h2>
              <p className="text-slate-600 mb-6">
                We are a dedicated team of urban planners, software engineers, and civic enthusiasts working to improve road infrastructure management through technology.
              </p>
              <p className="text-slate-600 mb-6">
                Our mission is to create safer roads and more efficient public works departments by connecting citizens directly with officials responsible for maintaining infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5,000+</div>
                  <div className="text-slate-600 mt-2">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">25+</div>
                  <div className="text-slate-600 mt-2">Cities Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">95%</div>
                  <div className="text-slate-600 mt-2">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">48 hrs</div>
                  <div className="text-slate-600 mt-2">Avg. Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Get In Touch</h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Have questions about our platform? Need help implementing RoadCare in your city? Contact us!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Send Us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  ></textarea>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 w-full">
                  Send Message
                </button>
              </form>
            </div>
            
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="text-slate-600">123 Innovation Way,<br />Smart City, SC 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="text-slate-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="text-slate-600">contact@roadcare.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Operating Hours</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monday - Friday</span>
                    <span className="text-slate-800 font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Saturday</span>
                    <span className="text-slate-800 font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sunday</span>
                    <span className="text-slate-800 font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <MapPin size={24} />
                <span className="text-xl font-bold">RoadCare</span>
              </div>
              <p className="text-slate-400">Making our roads safer and better maintained through civic engagement and technology.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-slate-400 hover:text-white transition">Home</a></li>
                <li><a href="#features" className="text-slate-400 hover:text-white transition">Features</a></li>
                <li><a href="#about" className="text-slate-400 hover:text-white transition">About Us</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Newsletter</h4>
              <p className="text-slate-400 mb-4">Subscribe to our newsletter for updates.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent flex-grow bg-slate-700 border-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} RoadCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}