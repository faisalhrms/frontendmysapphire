export default function TypingIndicator() {
  return (
    <span className="inline-flex ml-1 gap-1 items-center">
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
    </span>
  )
}
