import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  ShoppingBag, 
  MessageCircle, 
  MapPin, 
  User,
  LogOut,
  CreditCard,
  Search,
  ChevronDown,
  Check,
  ChevronRight,
  Edit2,
  Wine,
  FileText,
  Shield,
  X,
  Send
} from 'lucide-react';
import axios from 'axios';

// // Enhanced FAQ Data with bilingual support
// const FAQ_DATA = [
//   {
//     q: "shop timings|दुकान वेळ|timing|वेळ",
//     a: "Our shop is open from 10 AM to 10 PM every day.\nआमचं दुकान दररोज सकाळी १० ते रात्री १० वाजेपर्यंत उघडं असतं."
//   },
//   {
//     q: "location|address|दुकान कुठे|पत्ता",
//     a: "We have multiple stores across the city. Please check your nearest store using the location selector.\nशहरात आमची अनेक दुकाने आहेत. कृपया लोकेशन सिलेक्टर वापरून तुमच्या जवळचं दुकान तपासा."
//   },
//   {
//     q: "brands|ब्रँड्स|विकता",
//     a: "We offer a wide selection of premium brands including:\n\n🥃 Whiskey: Jack Daniel's, Glenfiddich, Chivas Regal\n🍷 Wine: Sula, Grover, Jacob's Creek\n🍺 Beer: Kingfisher, Heineken, Corona\n\nआम्ही प्रीमियम ब्रँड्सची विस्तृत निवड देतो."
//   },
//   {
//     q: "delivery|डिलिव्हरी|होम डिलिव्हरी",
//     a: "Yes, we offer home delivery! 🚚\n\n• Delivery Hours: 10 AM to 10 PM\n• Minimum Order: ₹500\n• Free delivery on orders above ₹2000\n\nहो, आम्ही होम डिलिव्हरी देतो! 🚚"
//   },
//   {
//     q: "payment|पेमेंट|payment methods|पैसे",
//     a: "We accept multiple payment methods:\n\n💳 Credit/Debit Cards\n📱 UPI (GPay, PhonePe)\n💰 Cash on Delivery\n\nआम्ही विविध पेमेंट पद्धती स्वीकारतो."
//   },
//   {
//     q: "age|वय|legal age|कायदेशीर वय",
//     a: "Legal drinking age is 21 years. Valid ID proof is mandatory.\n\nकायदेशीर वय २१ वर्षे आहे. वैध ओळखपत्र आवश्यक आहे."
//   },
//   {
//     q: "offers|ऑफर|discount|सूट",
//     a: "🎉 Current Offers:\n\n• 10% off on premium whiskey\n• Buy 2 get 1 free on selected wines\n• Special weekend discounts\n\nCheck our app regularly for new offers!"
//   },
//   {
//     q: "return|refund|परतावा|रिफंड",
//     a: "Returns accepted only for damaged or incorrect products within 24 hours.\n\nनुकसान झालेल्या किंवा चुकीच्या प्रॉडक्टसाठी २४ तासांच्या आत परतावा स्वीकारला जातो."
//   },
//   {
//     q: "hello|hi|hey|नमस्कार|हाय",
//     a: "Hello! 👋 Welcome to Liquor Shop. How can I help you today?\n\nनमस्कार! 👋 लिकर शॉपमध्ये आपले स्वागत आहे. मी आपली कशी मदत करू शकतो?"
//   },
//   {
//     q: "bye|goodbye|thank|धन्यवाद|बाय",
//     a: "Thank you for chatting with us! 🙏 Have a great day!\n\nचॅट केल्याबद्दल धन्यवाद! 🙏 आपला दिवस चांगला जावो!"
//   }
// ];

// interface Message {
//   text: string;
//   isBot: boolean;
// }

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [balance, setBalance] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('pune, Maharashtra');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
  phone: ''
  });
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [isChatOpen, setIsChatOpen] = useState(false);
    // Fetch user profile data using useEffect
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const userId = localStorage.getItem('userId'); // Replace with your actual auth logic
          const response = await axios.get(`https://peghouse.in/api/users/${userId}`);
          const user = response.data;
  
          setUserInfo({
            name: user.name,
            phone: user.mobile
          });
        } catch (error) {
          console.error('Failed to fetch profile', error);
        }
      };
  
      fetchUserProfile();
    }, []);  // Empty dependency array ensures this effect runs only once
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { 
      text: "Hello! 👋 Welcome to Liquor Shop. How can I help you today?\n\nनमस्कार! लिकर शॉपमध्ये आपले स्वागत आहे. मी आपली कशी मदत करू शकतो?", 
      isBot: true 
    },
    { 
      text: "You can ask me about:\n\n🕒 Shop timings\n🚚 Delivery\n💳 Payment methods\n🎁 Offers\n📜 Age requirements\n\nकृपया विचारा:\n\n🕒 दुकानाची वेळ\n🚚 डिलिव्हरी\n💳 पेमेंट\n🎁 ऑफर्स\n📜 वय आवश्यकता", 
      isBot: true 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
    // The click handler for navigating to the Order History page
    const handleOrdersClick = () => {
      navigate('/order-history');  // Navigate to the OrderHistory page
    };
  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Pune, Maharashtra',
    'Hyderabad, Telangana'
  ];

  const handleAddBalance = () => {
    
  };
  
  const handleRateOrder = () => {
    alert('Rating system will be implemented here');
  };
  
  const handleLogout = () => {
    // Clear any stored user info (optional but recommended)
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');  // if you're using tokens
    
    // Navigate to Login page
    navigate('/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // For phone, validate only digits and length <= 10
    if (name === 'phone') {
      if (!/^\d{0,10}$/.test(value)) return;
    }
  
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleEditProfile = () => {
    setIsEditing(false); // only sets editing mode true
  };
  
  const handleSaveChanges = async () => {
    if (userInfo.phone.length !== 10) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }
  
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.put(
        `https://peghouse.in/api/users/profile/${userId}`,
        userInfo
      );
      setUserInfo(response.data);
      setIsEditing(false); // Save successful, now exit editing mode
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };
  
  

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check for greetings or thanks first
    const isGreeting = /\b(hello|hi|hey|नमस्कार|हाय)\b/i.test(lowerInput);
    const isFarewell = /\b(bye|goodbye|thank|धन्यवाद|बाय)\b/i.test(lowerInput);

    let matchedFAQ;
    if (isGreeting) {
      matchedFAQ = FAQ_DATA.find(faq => faq.q.includes("hello"));
    } else if (isFarewell) {
      matchedFAQ = FAQ_DATA.find(faq => faq.q.includes("bye"));
    } else {
      // Look for matching FAQ
      matchedFAQ = FAQ_DATA.find(faq => 
        faq.q.split('|').some(keyword => lowerInput.includes(keyword))
      );
    }

    if (matchedFAQ) {
      return matchedFAQ.a;
    }

    // Generate contextual response if no direct match
    if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return "Prices vary by brand and size. Please check our app or visit the store for current prices.\n\nकिंमती ब्रँड आणि साइझनुसार बदलतात. कृपया सध्याच्या किमतींसाठी आमचा ऍप तपासा किंवा स्टोरला भेट द्या.";
    }

    if (lowerInput.includes('cancel') || lowerInput.includes('रद्द')) {
      return "Orders can be cancelled within 5 minutes of placing them. Contact our support team for assistance.\n\nऑर्डर केल्यानंतर ५ मिनिटांच्या आत रद्द करता येतील. मदतीसाठी आमच्या सपोर्ट टीमशी संपर्क साधा.";
    }

    // Default response with suggestions
    return "I'm not quite sure about that. Here are some topics I can help you with:\n\n" +
           "• Shop timings and location\n" +
           "• Delivery information\n" +
           "• Payment methods\n" +
           "• Current offers\n" +
           "• Age requirements\n\n" +
           "You can also reach our support team at 1800-XXX-XXXX 📞";
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = { text: chatInput, isBot: false };
    setChatMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const aiResponse = generateAIResponse(chatInput);

    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: aiResponse, isBot: true }]);
    }, 500);

    setChatInput('');
  };

  interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
  }

  const MenuItem = ({ icon, label, onClick, active = false }: MenuItemProps) => {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
          active ? 'bg-gray-100' : ''
        }`}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 mr-4 flex items-center justify-center">
            {icon}
          </div>
          <span className="font-medium">{label}</span>
        </div>
      </button>
    );
  };

  const Header = () => {
    const navigate = useNavigate();

    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center space-x-8">
            <div 
  className="flex items-center cursor-pointer"
  onClick={() => navigate('/dashboard')}
>
<img
  src="/finallogo.png"
  alt="Drnkly Logo"
  className="h-20 md:h-28 lg:h-35 mx-auto object-contain"
/>


 
</div>

              <div className="relative">
                <button 
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center text-sm font-medium hover:text-red-600 transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedLocation}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
         
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('premium')}
                className="bg-amber-100 text-amber-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-amber-200 transition-colors"
              >
                GET PREMIUM
              </button>
              <button className="flex flex-col items-center hover:text-red-600 transition-colors">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Profile</span>
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex flex-col items-center hover:text-red-600 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  const ProfileHeader = () => {
    return (
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-3xl font-semibold">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {isEditing ? (
            <div>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleUserInfoChange}
                className="block w-full rounded border-gray-300 mb-2 px-3 py-2"
                placeholder="Name"
              />
              <input
                type="tel"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserInfoChange}
                className="block w-full rounded border-gray-300 px-3 py-2"
                placeholder="Phone"
              />
              {/* 🛠️ Add this validation immediately below the phone input */}
                  {userInfo.phone && userInfo.phone.length !== 10 && (
                    <p className="text-red-500 text-sm mt-1">
                      Mobile number must be exactly 10 digits.
                    </p>
                  )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold">{userInfo.name}</h2>
              <p className="text-gray-500 text-lg">{userInfo.phone}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              handleSaveChanges(); // Only save if already editing
            } else {
              setIsEditing(true);  // Else, start editing
            }
          }}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          {isEditing ? (
            <span className="font-medium">Save</span>
          ) : (
            <>
              <Edit2 className="w-5 h-5 mr-2" />
              <span className="font-medium">Edit</span>
            </>
          )}
        </button>


      </div>
    );
  
  };
  const BalanceSection = () => {
    return (
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between py-4 px-6 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-md flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <span className="ml-4 text-lg font-medium">Liquor Shop Wallet</span>
          </div>
          <ChevronRight className="h-6 w-6 text-gray-400" />
        </div>
  
        {/* Available Balance Display */}
        <div className="mt-6 px-6">
          <p className="text-gray-500 text-lg">Available Balance:</p>
          <p className="text-2xl font-semibold mt-1">₹{balance}</p>
        </div>
      </div>
    );
  };

  const OrderItem = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <div className="flex">
            <div className="mr-3 w-16 h-16 border border-gray-200 rounded-lg p-2 flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/3089663/pexels-photo-3089663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Wine" 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
            <div className="mr-3 w-16 h-16 border border-gray-200 rounded-lg p-2 flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Whiskey" 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Order delivered</span>
            <div className="ml-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="text-white w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-xl">₹2,599.90</span>
            <ChevronRight className="ml-2 w-6 h-6 text-gray-400" />
          </div>
        </div>
        
        <div className="text-gray-500 text-lg">
          Placed at 21st Apr 2025, 02:40 pm
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleRateOrder}
            className="text-gray-700 font-medium hover:text-red-600 transition-colors"
          >
            Rate your order
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="p-6">
    <div className="flex items-center mb-6">
      <button 
        onClick={handleOrdersClick}  // Use the handleOrdersClick function for navigation
        className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6 transform rotate-180" />
      </button>
      <h2 className="text-2xl font-semibold">Orders</h2>
    </div>

          </div>
        );
      case 'wallet':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveTab('profile')} 
                className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6 transform rotate-180" />
              </button>
              <h2 className="text-2xl font-semibold">Liquor Shop Wallet</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
              <p className="text-gray-500">No transactions yet</p>
            </div>
          </div>
        );
      case 'premium':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveTab('profile')} 
                className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6 transform rotate-180" />
              </button>
              <h2 className="text-2xl font-semibold">Premium Membership</h2>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amber-800 mb-4">Premium Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-amber-700">
                  <Check className="w-5 h-5 mr-2" />
                  Exclusive discounts on premium liquors
                </li>
                <li className="flex items-center text-amber-700">
                  <Check className="w-5 h-5 mr-2" />
                  Priority delivery
                </li>
                <li className="flex items-center text-amber-700">
                  <Check className="w-5 h-5 mr-2" />
                  Special event invitations
                </li>
              </ul>
              <button className="mt-6 w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveTab('profile')} 
                className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6 transform rotate-180" />
              </button>
              <h2 className="text-2xl font-semibold">Terms & Regulations</h2>
            </div>
            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              <section>
                <h3 className="text-xl font-semibold mb-3">Terms & Conditions:</h3>
                <ul className="space-y-4 text-gray-700">
                  <li>
                    <p><strong>1. Age Verification & Legal Drinking Age:</strong> The customer must confirm they are 21 years or older (Hard Liquor Prohibited) or 25 years or older (for All liquor) as per Maharashtra excise rules. Age verification via government ID (Aadhaar, PAN, Driving License, Passport) is mandatory before delivery.</p>
                  </li>
                  
                  <li>
                    <p><strong>2. Prohibition of Sale to Intoxicated Persons:</strong> Liquor will not be delivered to anyone who appears intoxicated at the time of delivery.</p>
                  </li>
                  
                  <li>
                    <p><strong>3. Prohibition of Sale in Dry Areas:</strong> Liquor cannot be sold or delivered in dry areas (where prohibition is enforced). The customer must confirm their delivery location is not in a dry zone.</p>
                  </li>
                  
                  <li>
                    <p><strong>4. Restricted Timings for Sale & Delivery:</strong> Liquor delivery is allowed only during permitted hours (typically 11 AM to 11 PM in most areas, subject to local regulations).</p>
                  </li>
                  
                  <li>
                    <p><strong>5. Quantity Restrictions:</strong> Customers cannot purchase beyond the permissible limit (e.g., 3 liters of IMFL or 9 liters of beer per person per transaction). Bulk purchases may require additional permits.</p>
                  </li>
                  
                  <li>
                    <p><strong>6. No Resale or Supply to Minors:</strong> The customer must agree not to resell liquor and not to supply it to minors (under 21/25).</p>
                  </li>
                  
                  <li>
                    <p><strong>7. Valid ID Proof Required at Delivery:</strong> The delivery agent will verify the customer's original ID at the time of delivery. If ID is not provided, the order will be cancelled.</p>
                  </li>
                  
                  <li>
                    <p><strong>8. No Returns or Refunds for Sealed Liquor Bottles:</strong> Once liquor is sold, returns or refunds are not permitted unless the product is damaged/spoiled (as per excise rules).</p>
                  </li>
                  
                  <li>
                    <p><strong>9. Compliance with Local Municipal & Police Regulations:</strong> The customer must ensure that liquor consumption at their location complies with local laws (e.g., no consumption in public places).</p>
                  </li>
                  
                  <li>
                    <p><strong>10. Liability Disclaimer:</strong> The business is not responsible for misuse, overconsumption, or illegal resale by the customer.</p>
                  </li>
                  
                  <li>
                    <p><strong>11. Right to Refuse Service:</strong> The business reserves the right to cancel orders if: The customer fails age verification. The delivery location is in a dry area or restricted zone. Suspicion of fraudulent activity.</p>
                  </li>
                  
                  <li>
                    <p><strong>12. Data Privacy & Use of Customer Information:</strong> Customer ID and personal data will be stored as per excise department requirements and may be shared with authorities if required.</p>
                  </li>
                  
                  <li>
                    <p><strong>13. Mandatory Compliance with Maharashtra Excise Laws:</strong> The customer agrees that the sale is governed by the Maharashtra Prohibition Act, 1949, and any violation may lead to legal action.</p>
                  </li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">Government Rules & Excise Acts:</h3>
                <ul className="list-disc pl-5">
                  <li>✔ Maharashtra: Age 21</li>
                  <li>✔ Delhi: Age 25</li>
                  <li>✔ Karnataka: Age 21</li>
                  <li>✔ Tamil Nadu: Only TASMAC allowed</li>
                  <li>✔ Gujarat: Alcohol banned</li>
                  <li>✔ Telangana: Excise Act applies</li>
                </ul>
              </section>
              
              <section className="text-center mt-6">
                <p className="text-lg text-red-600 font-semibold">
                  🚭 तुमच्या कुटुंबासाठी मद्यपान आणि धूम्रपान सोडा – आरोग्य हाच खरा धन आहे 
                </p>
              </section>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveTab('profile')} 
                className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6 transform rotate-180" />
              </button>
              <h2 className="text-2xl font-semibold">Government Rules & Regulations</h2>
            </div>
            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              <section>
                <h3 className="text-xl font-semibold mb-3">Government Rules & Regulations</h3>
                <ul className="space-y-4 text-gray-700">
                  <li>
                    <p><strong>1. Age Verification & Legal Drinking Age</strong></p>
                    <p className="ml-6">The customer must confirm they are 21 years or older (Hard Liquor Prohibited) or 25 years or older (for All liquor) as per Maharashtra excise rules.</p>
                    <p className="ml-6">Age verification via government ID (Aadhaar, PAN, Driving License, Passport) is mandatory before delivery.</p>
                  </li>
                  
                  <li>
                    <p><strong>2. Prohibition of Sale to Intoxicated Persons</strong></p>
                    <p className="ml-6">Liquor will not be delivered to anyone who appears intoxicated at the time of delivery.</p>
                  </li>
                  
                  <li>
                    <p><strong>3. Prohibition of Sale in Dry Areas</strong></p>
                    <p className="ml-6">Liquor cannot be sold or delivered in dry areas (where prohibition is enforced). The customer must confirm their delivery location is not in a dry zone.</p>
                  </li>
                  
                  <li>
                    <p><strong>4. Restricted Timings for Sale & Delivery</strong></p>
                    <p className="ml-6">Liquor delivery is allowed only during permitted hours (typically 11 AM to 11 PM in most areas, subject to local regulations).</p>
                  </li>
                  
                  <li>
                    <p><strong>5. Quantity Restrictions</strong></p>
                    <p className="ml-6">Customers cannot purchase beyond the permissible limit (e.g., 3 liters of IMFL or 9 liters of beer per person per transaction). Bulk purchases may require additional permits.</p>
                  </li>
                  
                  <li>
                    <p><strong>6. No Resale or Supply to Minors</strong></p>
                    <p className="ml-6">The customer must agree not to resell liquor and not to supply it to minors (under 21/25).</p>
                  </li>
                  
                  <li>
                    <p><strong>7. Valid ID Proof Required at Delivery</strong></p>
                    <p className="ml-6">The delivery agent will verify the customer's original ID at the time of delivery. If ID is not provided, the order will be cancelled.</p>
                  </li>
                  
                  <li>
                    <p><strong>8. No Returns or Refunds for Sealed Liquor Bottles</strong></p>
                    <p className="ml-6">Once liquor is sold, returns or refunds are not permitted unless the product is damaged/spoiled (as per excise rules).</p>
                  </li>
                  
                  <li>
                    <p><strong>9. Compliance with Local Municipal & Police Regulations</strong></p>
                    <p className="ml-6">The customer must ensure that liquor consumption at their location complies with local laws (e.g., no consumption in public places).</p>
                  </li>
                  
                  <li>
                    <p><strong>10. Liability Disclaimer</strong></p>
                    <p className="ml-6">The business is not responsible for misuse, overconsumption, or illegal resale by the customer.</p>
                  </li>
                  
                  <li>
                    <p><strong>11. Right to Refuse Service</strong></p>
                    <p className="ml-6">The business reserves the right to cancel orders if:</p>
                    <p className="ml-12">The customer fails age verification.</p>
                    <p className="ml-12">The delivery location is in a dry area or restricted zone.</p>
                    <p className="ml-12">Suspicion of fraudulent activity.</p>
                  </li>
                  
                  <li>
                    <p><strong>12. Data Privacy & Use of Customer Information</strong></p>
                    <p className="ml-6">Customer ID and personal data will be stored as per excise department requirements and may be shared with authorities if required.</p>
                  </li>
                  
                  <li>
                    <p><strong>13. Mandatory Compliance with Maharashtra Excise Laws</strong></p>
                    <p className="ml-6">The customer agrees that the sale is governed by the Maharashtra Prohibition Act, 1949, and any violation may lead to legal action.</p>
                  </li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">Declaration</h3>
                <p className="text-gray-700 font-medium p-4 bg-gray-100 rounded-lg border border-gray-300">
                  "I confirm that I am above the legal drinking age, my delivery location is not in a dry area, and I agree to the Terms & Conditions."
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">State-Wise Legal Drinking Age</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>✔ Maharashtra: Age 21</li>
                  <li>✔ Delhi: Age 25</li>
                  <li>✔ Karnataka: Age 21</li>
                  <li>✔ Tamil Nadu: Only TASMAC allowed</li>
                  <li>✔ Gujarat: Alcohol banned</li>
                  <li>✔ Telangana: Excise Act applies</li>
                </ul>
              </section>
              
              <section className="text-center mt-6">
                <p className="text-lg text-red-600 font-semibold">
                  🚭 तुमच्या कुटुंबासाठी मद्यपान आणि धूम्रपान सोडा – आरोग्य हाच खरा धन आहे 
                </p>
              </section>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveTab('profile')} 
                className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6 transform rotate-180" />
              </button>
              <h2 className="text-2xl font-semibold">About Us</h2>
            </div>
            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              <section>
                <h3 className="text-xl font-semibold mb-3">Drnkly - Your Favorite Drinks, Delivered</h3>
                <div className="mb-6">
                  <img 
                    src="/finallogo.png" 
                    alt="Drnkly Logo" 
                    className="h-28 object-contain mx-auto mb-4" 
                  />
                </div>
                <p className="text-gray-700 mb-4">
                  Drnkly is Pune's premier alcohol delivery platform, designed to bring your favorite drinks directly to your doorstep with just a few taps. We believe in responsible drinking and convenient access to quality beverages.
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-gray-700 mb-4">
                  To provide a safe, legal, and convenient way for adults to purchase alcoholic beverages while strictly adhering to government regulations and promoting responsible consumption.
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">What We Offer</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Wide selection of alcoholic beverages including whisky, beer, wine and more</li>
                  <li>Verified quality products sourced directly from authorized dealers</li>
                  <li>Fast and reliable delivery within permitted hours</li>
                  <li>Secure payment options</li>
                  <li>Age verification and strict compliance with excise laws</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">Our Partners</h3>
                <p className="text-gray-700 mb-4">
                  We're proud to partner with authorized retailers like PK Wines and Sunrise Family Garden Restaurant to ensure you receive only authentic products with proper documentation.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="border rounded-lg p-2 w-32 h-32 flex items-center justify-center">
                    <p className="text-center font-semibold">PK Wines</p>
                  </div>
                  <div className="border rounded-lg p-2 w-32 h-32 flex items-center justify-center">
                    <p className="text-center font-semibold">Sunrise Family Garden Restaurant</p>
                  </div>
                </div>
              </section>
              
              <section>
                <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                <p className="text-gray-700">
                  Have questions? Get in touch with us:
                </p>
                <ul className="text-gray-700 space-y-2 mt-2">
                  <li><strong>Email:</strong> support@drnkly.com</li>
                  <li><strong>Phone:</strong> +91 1234567890</li>
                  <li><strong>Hours:</strong> 11:00 AM - 11:00 PM</li>
                </ul>
              </section>
              
              <section className="text-center mt-6">
                <p className="text-lg text-red-600 font-semibold">
                  🚭 तुमच्या कुटुंबासाठी मद्यपान आणि धूम्रपान सोडा – आरोग्य हाच खरा धन आहे 
                </p>
              </section>
            </div>
          </div>
        );
      default:
        return (
          <>
            <ProfileHeader />
            <BalanceSection />
            
            <div className="mt-4">
              <MenuItem 
                icon={<ShoppingBag className="w-5 h-5 text-gray-700" />} 
                label="Orders" 
                onClick={() => setActiveTab('orders')}
              />
              <MenuItem 
                icon={<MessageCircle className="w-5 h-5 text-gray-700" />} 
                label="Customer Support" 
                onClick={() => setIsChatOpen(true)}
              />
              <MenuItem 
                icon={<FileText className="w-5 h-5 text-gray-700" />} 
                label="Terms & Conditions" 
                onClick={() => setActiveTab('terms')}
              />
              <MenuItem 
                icon={<Shield className="w-5 h-5 text-gray-700" />} 
                label="Government Rules" 
                onClick={() => setActiveTab('privacy')}
              />
              <MenuItem 
                icon={<MapPin className="w-5 h-5 text-gray-700" />} 
                label="Addresses" 
                onClick={() => setActiveTab('addresses')}
              />
               <MenuItem 
                icon={<User className="w-5 h-5 text-gray-700" />} 
                label="About Us" 
                onClick={() => setActiveTab('about')}
              />
            </div>
            
            <div className="p-6 flex justify-center">
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-700 font-medium hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </button>
            </div>
          </>
        );
    }
  };

  useEffect(() => {
    // Check if user skipped login
    const isSkipped = localStorage.getItem('isSkippedLogin');
    if (isSkipped) {
      navigate('/login'); // Redirect to login if user hasn't logged in
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50">
          <div className="p-4 bg-red-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Liquor Shop Support</h3>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
