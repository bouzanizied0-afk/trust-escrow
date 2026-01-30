<!DOCTYPE html>
<html lang="en">
<head>
    <base target="_self">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>P2P Trading Platform - Enhanced Messaging</title>
    <meta name="description" content="Peer-to-peer cryptocurrency trading platform with WhatsApp-like messaging system">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#0ea5e9",
                        secondary: "#64748b",
                        success: "#10b981",
                        warning: "#f59e0b",
                        danger: "#ef4444",
                        dark: {
                            50: "#f8fafc",
                            100: "#f1f5f9",
                            200: "#e2e8f0",
                            300: "#cbd5e1",
                            400: "#94a3b8",
                            500: "#64748b",
                            600: "#475569",
                            700: "#334155",
                            800: "#1e293b",
                            900: "#0f172a",
                            950: "#020617"
                        }
                    },
                    fontFamily: {
                        sans: ["Inter", "system-ui", "sans-serif"]
                    },
                    animation: {
                        "fade-in": "fadeIn 0.3s ease-in-out",
                        "slide-up": "slideUp 0.3s ease-out",
                        "pulse-slow": "pulse 2s infinite"
                    },
                    keyframes: {
                        fadeIn: {
                            "0%": { opacity: "0" },
                            "100%": { opacity: "1" }
                        },
                        slideUp: {
                            "0%": { transform: "translateY(10px)", opacity: "0" },
                            "100%": { transform: "translateY(0)", opacity: "1" }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: "Inter", system-ui, sans-serif;
        }
        
        .sidebar-transition {
            transition: transform 0.3s ease-in-out;
        }
        
        .message-bubble {
            max-width: 80%;
            word-wrap: break-word;
            animation: fadeIn 0.3s ease-in-out;
        }
        
        .order-status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #94a3b8;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .message-input {
            transition: all 0.2s ease;
        }
        
        .attachment-menu {
            animation: slideUp 0.2s ease-out;
        }
        
        .voice-recorder {
            animation: pulse-slow 2s infinite;
        }
        
        .emoji-picker {
            animation: fadeIn 0.2s ease-in-out;
        }
    </style>
</head>
<body class="min-h-screen bg-dark-950 text-gray-200">
    <!-- Main Container -->
    <div class="flex flex-col min-h-screen max-w-md mx-auto bg-dark-900">
        <!-- Top Header -->
        <header class="sticky top-0 z-20 bg-dark-900 border-b border-dark-800 px-4 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <button id="sidebarToggle" class="p-2 rounded-lg hover:bg-dark-800">
                        <i class="fas fa-bars text-lg"></i>
                    </button>
                    <div>
                        <h1 class="text-lg font-bold">P2P Trading</h1>
                        <p class="text-xs text-dark-400">Secure Peer-to-Peer Exchange</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="p-2 rounded-lg hover:bg-dark-800">
                        <i class="fas fa-bell"></i>
                    </button>
                    <button class="p-2 rounded-lg hover:bg-dark-800">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Sidebar -->
        <div id="sidebar" class="fixed inset-y-0 left-0 z-30 w-64 bg-dark-900 border-r border-dark-800 sidebar-transition transform -translate-x-full">
            <div class="p-4 border-b border-dark-800">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <i class="fas fa-user text-white"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold">User Account</h3>
                        <p class="text-sm text-dark-400">Verified Trader</p>
                    </div>
                </div>
            </div>
            
            <nav class="p-4">
                <ul class="space-y-2">
                    <li>
                        <a href="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800">
                            <i class="fas fa-home"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center space-x-3 p-3 rounded-lg bg-dark-800">
                            <i class="fas fa-exchange-alt"></i>
                            <span>P2P Trading</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800">
                            <i class="fas fa-wallet"></i>
                            <span>Wallet</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800">
                            <i class="fas fa-chart-line"></i>
                            <span>Spot Trading</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800">
                            <i class="fas fa-history"></i>
                            <span>History</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800">
                            <i class="fas fa-question-circle"></i>
                            <span>Support</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto scrollbar-hide" id="mainContent">
            <!-- Market Page (Default) -->
            <div id="marketPage" class="p-4">
                <!-- Market Tabs -->
                <div class="flex border-b border-dark-800 mb-6">
                    <button class="flex-1 py-3 font-semibold border-b-2 border-primary text-primary">
                        Buy
                    </button>
                    <button class="flex-1 py-3 font-semibold text-dark-400 hover:text-white">
                        Sell
                    </button>
                </div>

                <!-- Filters -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold">Available Offers</h2>
                        <button class="text-primary text-sm font-semibold">
                            <i class="fas fa-filter mr-1"></i> Filter
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm">
                            <option>All Cryptocurrencies</option>
                            <option>Bitcoin (BTC)</option>
                            <option>Ethereum (ETH)</option>
                            <option>USDT</option>
                        </select>
                        <select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm">
                            <option>All Payment Methods</option>
                            <option>Bank Transfer</option>
                            <option>Credit Card</option>
                            <option>PayPal</option>
                        </select>
                    </div>
                </div>

                <!-- Offers List -->
                <div class="space-y-4">
                    <!-- Offer Card 1 -->
                    <div class="bg-dark-800 rounded-xl p-4 border border-dark-700 cursor-pointer hover:border-primary/50 transition-all duration-200" data-trader="CryptoTrader88">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                                    <i class="fas fa-user text-primary"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold">CryptoTrader88</h3>
                                    <div class="flex items-center text-sm">
                                        <span class="text-success">98%</span>
                                        <span class="mx-1">•</span>
                                        <span class="text-dark-400">500+ trades</span>
                                    </div>
                                </div>
                            </div>
                            <span class="bg-dark-700 text-primary text-xs font-semibold px-2 py-1 rounded">
                                Verified
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Price</p>
                                <p class="font-bold">$54,320.50</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Available</p>
                                <p class="font-bold">2.5 BTC</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Limit</p>
                                <p class="font-bold">$500 - $5,000</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Payment</p>
                                <div class="flex items-center">
                                    <i class="fas fa-university text-sm mr-1"></i>
                                    <span class="font-semibold text-sm">Bank Transfer</span>
                                </div>
                            </div>
                        </div>
                        
                        <button class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition">
                            Buy Now
                        </button>
                    </div>

                    <!-- Offer Card 2 -->
                    <div class="bg-dark-800 rounded-xl p-4 border border-dark-700 cursor-pointer hover:border-primary/50 transition-all duration-200" data-trader="BitcoinPro">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                                    <i class="fas fa-user text-warning"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold">BitcoinPro</h3>
                                    <div class="flex items-center text-sm">
                                        <span class="text-success">99%</span>
                                        <span class="mx-1">•</span>
                                        <span class="text-dark-400">1200+ trades</span>
                                    </div>
                                </div>
                            </div>
                            <span class="bg-dark-700 text-primary text-xs font-semibold px-2 py-1 rounded">
                                Fast Trader
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Price</p>
                                <p class="font-bold">$54,315.75</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Available</p>
                                <p class="font-bold">1.8 BTC</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Limit</p>
                                <p class="font-bold">$100 - $10,000</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Payment</p>
                                <div class="flex items-center">
                                    <i class="fab fa-cc-visa text-sm mr-1"></i>
                                    <span class="font-semibold text-sm">Credit Card</span>
                                </div>
                            </div>
                        </div>
                        
                        <button class="w-full bg-dark-700 hover:bg-dark-600 text-white font-semibold py-3 rounded-lg transition">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <!-- Messages Page (Hidden by default) -->
            <div id="messagesPage" class="hidden h-full flex flex-col">
                <!-- Conversations List View -->
                <div id="conversationsList" class="flex-1 flex flex-col">
                    <!-- Search Bar -->
                    <div class="p-4 border-b border-dark-800">
                        <div class="relative">
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"></i>
                            <input type="text" placeholder="Search conversations..." class="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary">
                        </div>
                    </div>

                    <!-- Conversations -->
                    <div class="flex-1 overflow-y-auto">
                        <!-- Pinned Conversations -->
                        <div class="p-4 border-b border-dark-800">
                            <h3 class="text-sm font-semibold text-dark-400 mb-2">PINNED</h3>
                            <div class="space-y-2">
                                <div class="conversation-item flex items-center space-x-3 p-3 rounded-lg bg-dark-800 cursor-pointer" data-trader="CryptoTrader88">
                                    <div class="relative">
                                        <div class="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
                                            <i class="fas fa-user text-primary text-xl"></i>
                                        </div>
                                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-dark-800"></div>
                                        <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <i class="fas fa-thumbtack text-xs"></i>
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <h3 class="font-semibold truncate">CryptoTrader88</h3>
                                            <span class="text-xs text-dark-400">2 min ago</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-check-double text-success text-xs mr-1"></i>
                                            <p class="text-sm text-dark-400 truncate">Payment confirmed, please release the BTC</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- All Conversations -->
                        <div class="p-4">
                            <h3 class="text-sm font-semibold text-dark-400 mb-2">ALL MESSAGES</h3>
                            <div class="space-y-2">
                                <div class="conversation-item flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer" data-trader="BitcoinPro">
                                    <div class="relative">
                                        <div class="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
                                            <i class="fas fa-user text-warning text-xl"></i>
                                        </div>
                                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-dark-400 rounded-full border-2 border-dark-800"></div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <h3 class="font-semibold truncate">BitcoinPro</h3>
                                            <span class="text-xs text-dark-400">1 hour ago</span>
                                        </div>
                                        <p class="text-sm text-dark-400 truncate">Transaction completed successfully</p>
                                    </div>
                                </div>

                                <div class="conversation-item flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer" data-trader="CryptoQueen">
                                    <div class="relative">
                                        <div class="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
                                            <i class="fas fa-user text-success text-xl"></i>
                                        </div>
                                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-dark-800"></div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <h3 class="font-semibold truncate">CryptoQueen</h3>
                                            <span class="text-xs text-dark-400">3 hours ago</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-image text-primary text-xs mr-1"></i>
                                            <p class="text-sm text-dark-400 truncate">Sent a photo</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="conversation-item flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer" data-trader="TradingMaster">
                                    <div class="relative">
                                        <div class="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
                                            <i class="fas fa-user text-danger text-xl"></i>
                                        </div>
                                        <div class="absolute bottom-0 right-0 w-3 h-3 bg-dark-400 rounded-full border-2 border-dark-800"></div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-center">
                                            <h3 class="font-semibold truncate">TradingMaster</h3>
                                            <span class="text-xs text-dark-400">Yesterday</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-microphone text-warning text-xs mr-1"></i>
                                            <p class="text-sm text-dark-400 truncate">Voice message</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat View (Hidden by default) -->
                <div id="chatView" class="hidden flex-1 flex flex-col">
                    <!-- Chat Header -->
                    <div class="sticky top-0 z-10 bg-dark-900 border-b border-dark-800 p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <button id="backToConversations" class="p-2 rounded-lg hover:bg-dark-800">
                                    <i class="fas fa-arrow-left"></i>
                                </button>
                                <div class="relative">
                                    <div id="chatAvatar" class="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                                        <i class="fas fa-user text-primary text-lg"></i>
                                    </div>
                                    <div id="chatStatus" class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-dark-800"></div>
                                </div>
                                <div>
                                    <h3 id="chatName" class="font-semibold">CryptoTrader88</h3>
                                    <p id="chatStatusText" class="text-xs text-success">Online</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button class="p-2 rounded-lg hover:bg-dark-800">
                                    <i class="fas fa-phone-alt"></i>
                                </button>
                                <button class="p-2 rounded-lg hover:bg-dark-800">
                                    <i class="fas fa-video"></i>
                                </button>
                                <button class="p-2 rounded-lg hover:bg-dark-800">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Messages Container -->
                    <div id="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
                        <!-- Messages will be dynamically inserted here -->
                    </div>

                    <!-- Typing Indicator -->
                    <div id="typingIndicator" class="hidden px-4 py-2">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                                <i class="fas fa-user text-primary text-sm"></i>
                            </div>
                            <div class="bg-dark-800 rounded-2xl rounded-tl-none p-3">
                                <div class="typing-indicator">
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Message Input Area -->
                    <div class="sticky bottom-0 bg-dark-900 border-t border-dark-800 p-4">
                        <!-- Attachment Menu (Hidden by default) -->
                        <div id="attachmentMenu" class="hidden attachment-menu bg-dark-800 rounded-xl p-4 mb-4 grid grid-cols-4 gap-3">
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-image text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Photo</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-camera text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Camera</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-file text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Document</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-map-marker-alt text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Location</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-user-friends text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Contact</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-poll text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Poll</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-gift text-2xl text-primary mb-2"></i>
                                <span class="text-xs">GIF</span>
                            </button>
                            <button class="attachment-option flex flex-col items-center justify-center p-3 rounded-lg hover:bg-dark-700 transition">
                                <i class="fas fa-sticky-note text-2xl text-primary mb-2"></i>
                                <span class="text-xs">Note</span>
                            </button>
                        </div>

                        <!-- Emoji Picker (Hidden by default) -->
                        <div id="emojiPicker" class="hidden emoji-picker bg-dark-800 rounded-xl p-4 mb-4">
                            <div class="flex justify-between items-center mb-3">
                                <h4 class="font-semibold">Emoji</h4>
                                <button id="closeEmojiPicker" class="text-dark-400 hover:text-white">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="grid grid-cols-8 gap-2">
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">😊</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">😂</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">😍</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">👍</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">👋</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">🎉</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">💯</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">🔥</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">🚀</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">💎</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">💰</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">✅</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">❌</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">⚠️</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">🔒</button>
                                <button class="emoji-option text-2xl hover:bg-dark-700 rounded-lg p-2">📈</button>
                            </div>
                        </div>

                        <!-- Voice Recorder (Hidden by default) -->
                        <div id="voiceRecorder" class="hidden voice-recorder bg-dark-800 rounded-xl p-4 mb-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center">
                                        <i class="fas fa-microphone text-danger"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold">Recording...</p>
                                        <p id="recordingTime" class="text-sm text-dark-400">0:00</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button id="cancelRecording" class="p-2 rounded-lg hover:bg-dark-700">
                                        <i class="fas fa-times text-danger"></i>
                                    </button>
                                    <button id="sendRecording" class="p-2 rounded-lg bg-success hover:bg-success/90">
                                        <i class="fas fa-check"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="h-1 bg-dark-700 rounded-full overflow-hidden">
                                    <div id="recordingVisualizer" class="h-full bg-primary animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Main Input Area -->
                        <div class="flex items-center space-x-2">
                            <!-- Attachment Button -->
                            <button id="attachmentButton" class="p-3 rounded-full hover:bg-dark-800">
                                <i class="fas fa-plus"></i>
                            </button>

                            <!-- Emoji Button -->
                            <button id="emojiButton" class="p-3 rounded-full hover:bg-dark-800">
                                <i class="far fa-smile"></i>
                            </button>

                            <!-- Text Input -->
                            <div class="flex-1 bg-dark-800 rounded-full flex items-center">
                                <input 
                                    id="messageInput" 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    class="flex-1 bg-transparent px-4 py-3 focus:outline-none"
                                >
                                <!-- Voice Input Toggle -->
                                <button id="voiceToggle" class="p-2 mr-2 rounded-full hover:bg-dark-700">
                                    <i class="fas fa-microphone text-dark-400"></i>
                                </button>
                            </div>

                            <!-- Send Button -->
                            <button id="sendButton" class="p-3 rounded-full bg-primary hover:bg-primary/90">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>

                        <!-- Quick Actions -->
                        <div class="flex justify-center space-x-4 mt-3 text-sm">
                            <button class="quick-action flex items-center space-x-2 text-dark-400 hover:text-white">
                                <i class="fas fa-image"></i>
                                <span>Photo</span>
                            </button>
                            <button class="quick-action flex items-center space-x-2 text-dark-400 hover:text-white">
                                <i class="fas fa-camera"></i>
                                <span>Camera</span>
                            </button>
                            <button class="quick-action flex items-center space-x-2 text-dark-400 hover:text-white">
                                <i class="fas fa-file"></i>
                                <span>Document</span>
                            </button>
                            <button class="quick-action flex items-center space-x-2 text-dark-400 hover:text-white">
                                <i class="fas fa-microphone"></i>
                                <span>Voice</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Orders Page (Hidden by default) -->
            <div id="ordersPage" class="hidden p-4">
                <h2 class="text-lg font-bold mb-6">My Orders</h2>
                
                <!-- Order Tabs -->
                <div class="flex border-b border-dark-800 mb-6">
                    <button class="flex-1 py-3 font-semibold border-b-2 border-primary text-primary">
                        Pending
                    </button>
                    <button class="flex-1 py-3 font-semibold text-dark-400 hover:text-white">
                        Completed
                    </button>
                    <button class="flex-1 py-3 font-semibold text-dark-400 hover:text-white">
                        Cancelled
                    </button>
                </div>

                <!-- Orders List -->
                <div class="space-y-4">
                    <!-- Pending Order -->
                    <div class="bg-dark-800 rounded-xl p-4 border border-warning/30">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h3 class="font-semibold">Buy 0.5 BTC</h3>
                                <p class="text-sm text-dark-400">Order #TRX-789012</p>
                            </div>
                            <span class="order-status-badge bg-warning/20 text-warning">
                                Pending
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Amount</p>
                                <p class="font-bold">0.5 BTC</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Price</p>
                                <p class="font-bold">$27,160.25</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Counterparty</p>
                                <p class="font-semibold">CryptoTrader88</p>
                            </div>
                            <div>
                                <p class="text-sm text-dark-400 mb-1">Time Left</p>
                                <p class="font-bold text-warning">14:59</p>
                            </div>
                        </div>
                        
                        <div class="flex space-x-2">
                            <button class="flex-1 bg-success hover:bg-success/90 text-white font-semibold py-2 rounded-lg">
                                Release
                            </button>
                            <button class="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-semibold py-2 rounded-lg chat-from-order" data-trader="CryptoTrader88">
                                Chat
                            </button>
                            <button class="flex-1 bg-danger hover:bg-danger/90 text-white font-semibold py-2 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Disputes Page (Hidden by default) -->
            <div id="disputesPage" class="hidden p-4">
                <h2 class="text-lg font-bold mb-6">Disputes</h2>
                
                <!-- Open Dispute Button -->
                <div class="bg-dark-800 rounded-xl p-6 mb-6 text-center border border-dark-700">
                    <i class="fas fa-exclamation-triangle text-3xl text-warning mb-4"></i>
                    <h3 class="font-bold text-lg mb-2">Need Help with a Trade?</h3>
                    <p class="text-dark-400 mb-4">Open a dispute if you encounter issues with a transaction</p>
                    <button class="bg-warning hover:bg-warning/90 text-dark-900 font-bold py-3 px-6 rounded-lg">
                        Open New Dispute
                    </button>
                </div>
            </div>
        </main>

        <!-- Bottom Navigation -->
        <nav class="sticky bottom-0 bg-dark-900 border-t border-dark-800">
            <div class="flex">
                <button data-page="market" class="flex-1 flex flex-col items-center justify-center py-3 text-primary">
                    <i class="fas fa-chart-line text-lg mb-1"></i>
                    <span class="text-xs font-semibold">Market</span>
                </button>
                <button data-page="messages" class="flex-1 flex flex-col items-center justify-center py-3 text-dark-400 hover:text-white">
                    <i class="fas fa-comments text-lg mb-1"></i>
                    <span class="text-xs font-semibold">Messages</span>
                </button>
                <button data-page="orders" class="flex-1 flex flex-col items-center justify-center py-3 text-dark-400 hover:text-white">
                    <i class="fas fa-clipboard-list text-lg mb-1"></i>
                    <span class="text-xs font-semibold">My Orders</span>
                </button>
                <button data-page="disputes" class="flex-1 flex flex-col items-center justify-center py-3 text-dark-400 hover:text-white">
                    <i class="fas fa-gavel text-lg mb-1"></i>
                    <span class="text-xs font-semibold">Disputes</span>
                </button>
            </div>
        </nav>
    </div>

    <script>
        // Define application data
        const appData = {
            "currentPage": "market",
            "sidebarOpen": false,
            "currentChat": null,
            "isRecording": false,
            "recordingStartTime": null,
            "recordingInterval": null,
            "messages": {
                "CryptoTrader88": [
                    {
                        "id": 1,
                        "sender": "them",
                        "type": "text",
                        "content": "Hello, I"ve sent the payment via bank transfer. Please check your account and release the BTC.",
                        "timestamp": "10:30 AM",
                        "status": "read"
                    },
                    {
                        "id": 2,
                        "sender": "me",
                        "type": "text",
                        "content": "Payment received, I"m releasing the Bitcoin now. Please confirm once you receive it.",
                        "timestamp": "10:32 AM",
                        "status": "read"
                    },
                    {
                        "id": 3,
                        "sender": "them",
                        "type": "text",
                        "content": "Perfect! Transaction completed successfully. Thank you for the smooth trade.",
                        "timestamp": "10:35 AM",
                        "status": "read"
                    }
                ],
                "BitcoinPro": [
                    {
                        "id": 1,
                        "sender": "them",
                        "type": "text",
                        "content": "Transaction completed successfully. Let me know if you need anything else.",
                        "timestamp": "1 hour ago",
                        "status": "read"
                    }
                ],
                "CryptoQueen": [
                    {
                        "id": 1,
                        "sender": "them",
                        "type": "image",
                        "content": "Payment proof",
                        "imageUrl": "https://picsum.photos/300/200?random=1",
                        "timestamp": "3 hours ago",
                        "status": "delivered"
                    }
                ],
                "TradingMaster": [
                    {
                        "id": 1,
                        "sender": "them",
                        "type": "voice",
                        "content": "Voice message about trade details",
                        "duration": "0:45",
                        "timestamp": "Yesterday",
                        "status": "delivered"
                    }
                ]
            },
            "traders": {
                "CryptoTrader88": {
                    "name": "CryptoTrader88",
                    "status": "online",
                    "color": "primary",
                    "icon": "user"
                },
                "BitcoinPro": {
                    "name": "BitcoinPro",
                    "status": "offline",
                    "color": "warning",
                    "icon": "user"
                },
                "CryptoQueen": {
                    "name": "CryptoQueen",
                    "status": "online",
                    "color": "success",
                    "icon": "user"
                },
                "TradingMaster": {
                    "name": "TradingMaster",
                    "status": "offline",
                    "color": "danger",
                    "icon": "user"
                }
            }
        };

        // DOM Elements
        const sidebar = document.getElementById("sidebar");
        const sidebarToggle = document.getElementById("sidebarToggle");
        const mainContent = document.getElementById("mainContent");
        const bottomNavButtons = document.querySelectorAll("nav button[data-page]");
        const pages = {
            "market": document.getElementById("marketPage"),
            "messages": document.getElementById("messagesPage"),
            "orders": document.getElementById("ordersPage"),
            "disputes": document.getElementById("disputesPage")
        };
        
        // Messages Page Elements
        const conversationsList = document.getElementById("conversationsList");
        const chatView = document.getElementById("chatView");
        const backToConversations = document.getElementById("backToConversations");
        const messagesContainer = document.getElementById("messagesContainer");
        const messageInput = document.getElementById("messageInput");
        const sendButton = document.getElementById("sendButton");
        const attachmentButton = document.getElementById("attachmentButton");
        const attachmentMenu = document.getElementById("attachmentMenu");
        const emojiButton = document.getElementById("emojiButton");
        const emojiPicker = document.getElementById("emojiPicker");
        const closeEmojiPicker = document.getElementById("closeEmojiPicker");
        const voiceToggle = document.getElementById("voiceToggle");
        const voiceRecorder = document.getElementById("voiceRecorder");
        const cancelRecording = document.getElementById("cancelRecording");
        const sendRecording = document.getElementById("sendRecording");
        const recordingTime = document.getElementById("recordingTime");
        const recordingVisualizer = document.getElementById("recordingVisualizer");
        const typingIndicator = document.getElementById("typingIndicator");
        const chatName = document.getElementById("chatName");
        const chatAvatar = document.getElementById("chatAvatar");
        const chatStatus = document.getElementById("chatStatus");
        const chatStatusText = document.getElementById("chatStatusText");

        // Sidebar Toggle
        sidebarToggle.addEventListener("click", function() {
            appData.sidebarOpen = !appData.sidebarOpen;
            if (appData.sidebarOpen) {
                sidebar.classList.remove("-translate-x-full");
            } else {
                sidebar.classList.add("-translate-x-full");
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener("click", function(event) {
            if (appData.sidebarOpen && 
                !sidebar.contains(event.target) && 
                !sidebarToggle.contains(event.target)) {
                appData.sidebarOpen = false;
                sidebar.classList.add("-translate-x-full");
            }
        });

        // Page Navigation
        function navigateToPage(pageId) {
            // Hide all pages
            Object.values(pages).forEach(page => {
                if (page) page.classList.add("hidden");
            });
            
            // Show selected page
            if (pages[pageId]) {
                pages[pageId].classList.remove("hidden");
            }
            
            // Update bottom navigation active state
            bottomNavButtons.forEach(button => {
                if (button.getAttribute("data-page") === pageId) {
                    button.classList.remove("text-dark-400");
                    button.classList.add("text-primary");
                } else {
                    button.classList.remove("text-primary");
                    button.classList.add("text-dark-400");
                }
            });
            
            // Update app state
            appData.currentPage = pageId;
            
            // Reset messages view if navigating away
            if (pageId !== "messages") {
                showConversationsList();
            }
        }

        // Bottom Navigation Click Handlers
        bottomNavButtons.forEach(button => {
            button.addEventListener("click", function() {
                const pageId = this.getAttribute("data-page");
                navigateToPage(pageId);
            });
        });

        // Show conversations list
        function showConversationsList() {
            conversationsList.classList.remove("hidden");
            chatView.classList.add("hidden");
            appData.currentChat = null;
            hideAttachmentMenu();
            hideEmojiPicker();
            stopRecording();
        }

        // Show chat view
        function showChatView(traderName) {
            conversationsList.classList.add("hidden");
            chatView.classList.remove("hidden");
            appData.currentChat = traderName;
            
            // Update chat header
            const trader = appData.traders[traderName];
            chatName.textContent = traderName;
            chatAvatar.innerHTML = `<i class="fas fa-${trader.icon} text-${trader.color} text-lg"></i>`;
            chatStatus.className = `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-800 ${trader.status === "online" ? "bg-success" : "bg-dark-400"}`;
            chatStatusText.textContent = trader.status === "online" ? "Online" : "Offline";
            chatStatusText.className = `text-xs ${trader.status === "online" ? "text-success" : "text-dark-400"}`;
            
            // Load messages
            loadMessages(traderName);
            
            // Focus input
            messageInput.focus();
        }

        // Load messages for a trader
        function loadMessages(traderName) {
            messagesContainer.innerHTML = "";
            const messages = appData.messages[traderName] || [];
            
            messages.forEach(message => {
                const messageElement = createMessageElement(message);
                messagesContainer.appendChild(messageElement);
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Create message element
        function createMessageElement(message) {
            const div = document.createElement("div");
            div.className = message.sender === "me" ? "flex justify-end" : "flex";
            
            let content = "";
            if (message.type === "text") {
                content = `
                    <div class="message-bubble ${message.sender === "me" ? "bg-primary rounded-2xl rounded-tr-none" : "bg-dark-800 rounded-2xl rounded-tl-none"} p-4">
                        <p>${message.content}</p>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs ${message.sender === "me" ? "text-dark-300" : "text-dark-400"}">${message.timestamp}</span>
                            ${message.sender === "me" ? `
                                <div class="flex items-center space-x-1">
                                    ${message.status === "read" ? '<i class="fas fa-check-double text-success text-xs"></i>' : 
                                      message.status === "delivered" ? '<i class="fas fa-check-double text-dark-400 text-xs"></i>' : 
                                      '<i class="fas fa-check text-dark-400 text-xs"></i>'}
                                </div>
                            ` : ""}
                        </div>
                    </div>
                `;
            } else if (message.type === "image") {
                content = `
                    <div class="message-bubble ${message.sender === "me" ? "bg-primary rounded-2xl rounded-tr-none" : "bg-dark-800 rounded-2xl rounded-tl-none"} p-2">
                        <div class="relative">
                            <img src="${message.imageUrl}" alt="${message.content}" class="w-48 h-32 object-cover rounded-lg">
                            <div class="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <button class="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <i class="fas fa-expand text-white"></i>
                                </button>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mt-2 px-2 pb-1">
                            <span class="text-xs ${message.sender === "me" ? "text-dark-300" : "text-dark-400"}">${message.timestamp}</span>
                            ${message.sender === "me" ? `
                                <div class="flex items-center space-x-1">
                                    <i class="fas fa-check-double ${message.status === "read" ? "text-success" : "text-dark-400"} text-xs"></i>
                                </div>
                            ` : ""}
                        </div>
                    </div>
                `;
            } else if (message.type === "voice") {
                content = `
                    <div class="message-bubble ${message.sender === "me" ? "bg-primary rounded-2xl rounded-tr-none" : "bg-dark-800 rounded-2xl rounded-tl-none"} p-4">
                        <div class="flex items-center space-x-3">
                            <button class="w-8 h-8 rounded-full ${message.sender === "me" ? "bg-primary-600" : "bg-dark-700"} flex items-center justify-center">
                                <i class="fas fa-play text-xs"></i>
                            </button>
                            <div class="flex-1">
                                <div class="h-1 bg-dark-700 rounded-full overflow-hidden">
                                    <div class="h-full ${message.sender === "me" ? "bg-white" : "bg-primary"} w-3/4"></div>
                                </div>
                                <span class="text-xs ${message.sender === "me" ? "text-dark-300" : "text-dark-400"} mt-1 block">${message.duration}</span>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-xs ${message.sender === "me" ? "text-dark-300" : "text-dark-400"}">${message.timestamp}</span>
                            ${message.sender === "me" ? `
                                <div class="flex items-center space-x-1">
                                    <i class="fas fa-check-double ${message.status === "read" ? "text-success" : "text-dark-400"} text-xs"></i>
                                </div>
                            ` : ""}
                        </div>
                    </div>
                `;
            }
            
            div.innerHTML = content;
            return div;
        }

        // Send message
        function sendMessage() {
            const text = messageInput.value.trim();
            if (!text || !appData.currentChat) return;
            
            const newMessage = {
                id: Date.now(),
                sender: "me",
                type: "text",
                content: text,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "sent"
            };
            
            // Add to messages
            if (!appData.messages[appData.currentChat]) {
                appData.messages[appData.currentChat] = [];
            }
            appData.messages[appData.currentChat].push(newMessage);
            
            // Add to UI
            const messageElement = createMessageElement(newMessage);
            messagesContainer.appendChild(messageElement);
            
            // Clear input
            messageInput.value = "";
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate reply after delay
            setTimeout(() => {
                hideTypingIndicator();
                simulateReply();
            }, 1500);
        }

        // Simulate reply from trader
        function simulateReply() {
            if (!appData.currentChat) return;
            
            const replies = [
                "Thanks for your message!",
                "I"ll check and get back to you shortly.",
                "Payment confirmed, proceeding with the trade.",
                "Can you please send the payment proof?",
                "Transaction completed successfully."
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyMessage = {
                id: Date.now() + 1,
                sender: "them",
                type: "text",
                content: randomReply,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "read"
            };
            
            appData.messages[appData.currentChat].push(replyMessage);
            const messageElement = createMessageElement(replyMessage);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Show typing indicator
        function showTypingIndicator() {
            typingIndicator.classList.remove("hidden");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Hide typing indicator
        function hideTypingIndicator() {
            typingIndicator.classList.add("hidden");
        }

        // Attachment menu toggle
        function toggleAttachmentMenu() {
            attachmentMenu.classList.toggle("hidden");
            if (!attachmentMenu.classList.contains("hidden")) {
                emojiPicker.classList.add("hidden");
                voiceRecorder.classList.add("hidden");
            }
        }

        // Hide attachment menu
        function hideAttachmentMenu() {
            attachmentMenu.classList.add("hidden");
        }

        // Emoji picker toggle
        function toggleEmojiPicker() {
            emojiPicker.classList.toggle("hidden");
            if (!emojiPicker.classList.contains("hidden")) {
                attachmentMenu.classList.add("hidden");
                voiceRecorder.classList.add("hidden");
            }
        }

        // Hide emoji picker
        function hideEmojiPicker() {
            emojiPicker.classList.add("hidden");
        }

        // Voice recording functions
        function startRecording() {
            appData.isRecording = true;
            appData.recordingStartTime = Date.now();
            voiceRecorder.classList.remove("hidden");
            attachmentMenu.classList.add("hidden");
            emojiPicker.classList.add("hidden");
            
            // Update recording time
            appData.recordingInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - appData.recordingStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                recordingTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
                
                // Update visualizer
                const width = 30 + (Math.random() * 70);
                recordingVisualizer.style.width = `${width}%`;
            }, 100);
        }

        function stopRecording() {
            if (!appData.isRecording) return;
            
            appData.isRecording = false;
            clearInterval(appData.recordingInterval);
            voiceRecorder.classList.add("hidden");
            
            // Reset visualizer
            recordingVisualizer.style.width = "0%";
            recordingTime.textContent = "0:00";
        }

        function sendVoiceMessage() {
            if (!appData.currentChat) return;
            
            const duration = recordingTime.textContent;
            const voiceMessage = {
                id: Date.now(),
                sender: "me",
                type: "voice",
                content: "Voice message",
                duration: duration,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "sent"
            };
            
            if (!appData.messages[appData.currentChat]) {
                appData.messages[appData.currentChat] = [];
            }
            appData.messages[appData.currentChat].push(voiceMessage);
            
            const messageElement = createMessageElement(voiceMessage);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            stopRecording();
            
            // Simulate reply
            setTimeout(() => {
                simulateReply();
            }, 2000);
        }

        // Send image message
        function sendImageMessage() {
            if (!appData.currentChat) return;
            
            const imageMessage = {
                id: Date.now(),
                sender: "me",
                type: "image",
                content: "Payment proof",
                imageUrl: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 100)}`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "sent"
            };
            
            if (!appData.messages[appData.currentChat]) {
                appData.messages[appData.currentChat] = [];
            }
            appData.messages[appData.currentChat].push(imageMessage);
            
            const messageElement = createMessageElement(imageMessage);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            hideAttachmentMenu();
            
            // Simulate reply
            setTimeout(() => {
                simulateReply();
            }, 2000);
        }

        // Event Listeners
        document.addEventListener("DOMContentLoaded", function() {
            navigateToPage("market");
            
            // Conversation item click
            document.querySelectorAll(".conversation-item").forEach(item => {
                item.addEventListener("click", function() {
                    const traderName = this.getAttribute("data-trader");
                    showChatView(traderName);
                });
            });
            
            // Offer card click
            document.querySelectorAll("[data-trader]").forEach(card => {
                card.addEventListener("click", function() {
                    const traderName = this.getAttribute("data-trader");
                    navigateToPage("messages");
                    setTimeout(() => {
                        showChatView(traderName);
                    }, 50);
                });
            });
            
            // Chat from order button
            document.querySelectorAll(".chat-from-order").forEach(button => {
                button.addEventListener("click", function(e) {
                    e.stopPropagation();
                    const traderName = this.getAttribute("data-trader");
                    navigateToPage("messages");
                    setTimeout(() => {
                        showChatView(traderName);
                    }, 50);
                });
            });
            
            // Back to conversations
            backToConversations.addEventListener("click", showConversationsList);
            
            // Send message on enter
            messageInput.addEventListener("keypress", function(e) {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Send button
            sendButton.addEventListener("click", sendMessage);
            
            // Attachment button
            attachmentButton.addEventListener("click", toggleAttachmentMenu);
            
            // Emoji button
            emojiButton.addEventListener("click", toggleEmojiPicker);
            
            // Close emoji picker
            closeEmojiPicker.addEventListener("click", hideEmojiPicker);
            
            // Emoji selection
            document.querySelectorAll(".emoji-option").forEach(button => {
                button.addEventListener("click", function() {
                    messageInput.value += this.textContent;
                    messageInput.focus();
                });
            });
            
            // Voice toggle
            let isVoiceMode = false;
            voiceToggle.addEventListener("click", function() {
                isVoiceMode = !isVoiceMode;
                if (isVoiceMode) {
                    this.innerHTML = '<i class="fas fa-keyboard text-primary"></i>';
                    messageInput.placeholder = "Tap to record voice message...";
                    messageInput.addEventListener("click", startRecording);
                } else {
                    this.innerHTML = '<i class="fas fa-microphone text-dark-400"></i>';
                    messageInput.placeholder = "Type a message...";
                    messageInput.removeEventListener("click", startRecording);
                }
            });
            
            // Voice recording controls
            cancelRecording.addEventListener("click", stopRecording);
            sendRecording.addEventListener("click", sendVoiceMessage);
            
            // Attachment options
            document.querySelectorAll(".attachment-option").forEach(button => {
                button.addEventListener("click", function() {
                    const option = this.querySelector("span").textContent.toLowerCase();
                    switch(option) {
                        case "photo":
                        case "camera":
                            sendImageMessage();
                            break;
                        case "document":
                            alert("Document upload feature would be implemented here");
                            break;
                        case "location":
                            alert("Location sharing feature would be implemented here");
                            break;
                        case "contact":
                            alert("Contact sharing feature would be implemented here");
                            break;
                        case "poll":
                            alert("Poll creation feature would be implemented here");
                            break;
                        case "gif":
                            alert("GIF selection feature would be implemented here");
                            break;
                        case "note":
                            alert("Note creation feature would be implemented here");
                            break;
                    }
                    hideAttachmentMenu();
                });
            });
            
            // Quick actions
            document.querySelectorAll(".quick-action").forEach(button => {
                button.addEventListener("click", function() {
                    const action = this.querySelector("span").textContent.toLowerCase();
                    switch(action) {
                        case "photo":
                        case "camera":
                            sendImageMessage();
                            break;
                        case "document":
                            alert("Document upload feature would be implemented here");
                            break;
                        case "voice":
                            startRecording();
                            break;
                    }
                });
            });
            
            // Close menus when clicking outside
            document.addEventListener("click", function(event) {
                if (!attachmentMenu.contains(event.target) && !attachmentButton.contains(event.target)) {
                    hideAttachmentMenu();
                }
                if (!emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
                    hideEmojiPicker();
                }
            });
            
            // Market tabs
            const marketTabs = document.querySelectorAll("#marketPage button");
            marketTabs.forEach(tab => {
                tab.addEventListener("click", function() {
                    marketTabs.forEach(t => {
                        t.classList.remove("border-b-2", "border-primary", "text-primary");
                        t.classList.add("text-dark-400");
                    });
                    this.classList.add("border-b-2", "border-primary", "text-primary");
                    this.classList.remove("text-dark-400");
                });
            });
            
            // Order tabs
            const orderTabs = document.querySelectorAll("#ordersPage button");
            orderTabs.forEach(tab => {
                tab.addEventListener("click", function() {
                    orderTabs.forEach(t => {
                        t.classList.remove("border-b-2", "border-primary", "text-primary");
                        t.classList.add("text-dark-400");
                    });
                    this.classList.add("border-b-2", "border-primary", "text-primary");
                    this.classList.remove("text-dark-400");
                });
            });
        });

        // Simulate trade actions
        function simulateTradeAction(action, orderId) {
            const actions = {
                "release": "Cryptocurrency released successfully",
                "cancel": "Order cancelled",
                "dispute": "Dispute opened successfully"
            };
            
            if (actions[action]) {
                alert(actions[action]);
                if (action === "release" || action === "cancel") {
                    navigateToPage("orders");
                } else if (action === "dispute") {
                    navigateToPage("disputes");
                }
            }
        }

        // Add event listeners for action buttons
        document.addEventListener("click", function(event) {
            if (event.target.closest("button")) {
                const button = event.target.closest("button");
                const buttonText = button.textContent.trim();
                
                if (buttonText === "Release") {
                    simulateTradeAction("release");
                } else if (buttonText === "Cancel") {
                    if (confirm("Are you sure you want to cancel this order?")) {
                        simulateTradeAction("cancel");
                    }
                } else if (buttonText === "Open New Dispute") {
                    simulateTradeAction("dispute");
                }
            }
        });
    </script>
</body>
</html>
