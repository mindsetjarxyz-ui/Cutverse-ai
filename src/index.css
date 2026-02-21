@import "tailwindcss";

:root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0a0f1c 0%, #0f172a 50%, #0a0f1c 100%);
  color: #f8fafc;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Prevent horizontal scroll on mobile */
#root {
  overflow-x: hidden;
  width: 100%;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Selection color */
::selection {
  background: #3b82f6;
  color: white;
}

/* Focus visible */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Result text styling */
.result-text {
  font-size: 14px;
  line-height: 1.8;
  color: #e2e8f0;
  letter-spacing: 0.01em;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@media (min-width: 640px) {
  .result-text {
    font-size: 15px;
    line-height: 1.85;
  }
}

.result-text p {
  margin-bottom: 0;
}

.result-text .result-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
}

@media (min-width: 640px) {
  .result-text .result-title {
    font-size: 18px;
    margin-bottom: 12px;
  }
}

.result-text .result-heading {
  font-size: 14px;
  font-weight: 600;
  color: #93c5fd;
  margin-top: 10px;
  margin-bottom: 4px;
  line-height: 1.5;
}

@media (min-width: 640px) {
  .result-text .result-heading {
    font-size: 15px;
    margin-top: 12px;
  }
}

.result-text strong {
  font-weight: 600;
  color: #93c5fd;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Border width fix */
.border-3 {
  border-width: 3px;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover effect */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.3);
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

/* Pulse animation for loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Slow pulse animation for hero title */
@keyframes pulseSlow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.01);
  }
}

.animate-pulse-slow {
  animation: pulseSlow 4s ease-in-out infinite;
}

/* Gradient shift animation */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 100%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 0%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

/* Text glow animation for hero */
@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(99, 102, 241, 0.3), 0 0 60px rgba(139, 92, 246, 0.2);
  }
  50% {
    text-shadow: 0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(99, 102, 241, 0.5), 0 0 90px rgba(139, 92, 246, 0.3);
  }
}

.animate-text-glow {
  animation: textGlow 3s ease-in-out infinite;
}

/* Floating animation for background orbs */
@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Shimmer effect for title */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

/* Glass morphism effect */
.glass {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Hide scrollbar but allow scroll */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Scroll smooth for result box */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Mobile-specific form styles */
@media (max-width: 639px) {
  input, textarea, select, button {
    font-size: 16px !important; /* Prevents iOS zoom on focus */
  }
  
  textarea {
    min-height: 120px;
  }
  
  /* Ensure buttons are tap-friendly */
  button {
    min-height: 40px;
  }
  
  /* Better spacing on mobile */
  .mobile-stack {
    flex-direction: column;
  }
}

/* Responsive text areas */
textarea {
  resize: vertical;
  min-height: 100px;
}

@media (min-width: 640px) {
  textarea {
    min-height: 120px;
  }
}

@media (min-width: 768px) {
  textarea {
    min-height: 150px;
  }
}

/* Touch-friendly tap targets */
@media (pointer: coarse) {
  button, a, input[type="checkbox"], input[type="radio"] {
    min-height: 44px;
    min-width: 44px;
  }
  
  select {
    min-height: 44px;
  }
}

/* Fix for iOS momentum scrolling */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}

/* Word count buttons responsive */
.word-count-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.word-count-buttons button {
  flex: 1 1 auto;
  min-width: 60px;
}

@media (min-width: 640px) {
  .word-count-buttons button {
    flex: 0 0 auto;
    min-width: auto;
  }
}

/* Search dropdown animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-dropdown {
  animation: slideDown 0.15s ease-out;
}

/* Tool cards responsive grid */
@media (max-width: 379px) {
  .tool-card-grid {
    grid-template-columns: 1fr;
  }
}

/* Safe area insets for notched phones */
@supports (padding: env(safe-area-inset-bottom)) {
  footer {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}

/* Improve readability on small screens */
@media (max-width: 359px) {
  html {
    font-size: 14px;
  }
}

/* Fix button disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Better focus states for accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Image responsive */
img {
  max-width: 100%;
  height: auto;
}

/* Prevent text selection on buttons */
button {
  user-select: none;
  -webkit-user-select: none;
}

/* Custom checkbox/radio styling for better mobile UX */
input[type="checkbox"],
input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

@media (min-width: 640px) {
  input[type="checkbox"],
  input[type="radio"] {
    width: 16px;
    height: 16px;
  }
}

/* Hamburger button in header */
