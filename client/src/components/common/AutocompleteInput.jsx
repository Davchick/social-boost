import { useState, useRef, useEffect, forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { FIELD_INPUT_CLASS, FIELD_LABEL_CLASS } from '@/utils/fieldStyles'
import { getCityMatches, isCityAllowed } from '@/data/regions'

export const AutocompleteInput = forwardRef(function AutocompleteInput({
  label,
  error,
  className,
  value,
  onChange,
  onSelect,
  placeholder = '',
  name,
  ...props
}, ref) {
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const wrapperRef = useRef(null)

  // синхронизация value с inputValue
  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  // обработка изменений ввода
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setShowSuggestions(true)
    setActiveSuggestion(-1)
    
    // Вызываем onChange
    if (onChange) {
      const event = {
        ...e,
        target: {
          ...e.target,
          name,
          value: newValue
        }
      }
      onChange(event)
    }

    // обновляем подсказки
    updateSuggestions(newValue)
  }

  // обновление списка подсказок
  const updateSuggestions = (value) => {
    const matches = getCityMatches(value)
    setSuggestions(matches)
  }

  // выбор подсказки
  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    setActiveSuggestion(-1)
    
    if (onChange) {
      const event = {
        target: {
          name,
          value: suggestion
        }
      }
      onChange(event)
    }
    
    if (onSelect) {
      onSelect(suggestion)
    }
  }

  // обработка нажатия клавиш
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : 0
        )
        break
      case 'Enter':
        if (activeSuggestion >= 0) {
          e.preventDefault()
          handleSelectSuggestion(suggestions[activeSuggestion])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setActiveSuggestion(-1)
        break
      default:
        break
    }
  }

  // подсветка совпадений в тексте
  const highlightMatch = (text, query) => {
    if (!query) return text

    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    const index = textLower.indexOf(queryLower)
    
    if (index === -1) return text

    return (
      <>
        {text.substring(0, index)}
        <span className="bg-accent/20 text-accent font-medium">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    )
  }

  // обработка клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // обработка фокуса
  const handleFocus = () => {
    if (inputValue.length >= 2) {
      updateSuggestions(inputValue)
      setShowSuggestions(true)
    }
  }

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className={FIELD_LABEL_CLASS}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            FIELD_INPUT_CLASS,
            error && 'border-error focus:border-error',
            className
          )}
          {...props}
        />
        
        {/* Выпадающий список подсказок */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 py-2 rounded-lg border border-border bg-secondary shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={cn(
                  'px-4 py-2 cursor-pointer hover:bg-accent/10 transition-colors',
                  index === activeSuggestion ? 'bg-accent/10' : ''
                )}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {highlightMatch(suggestion, inputValue)}
              </li>
            ))}
          </ul>
        )}
        
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})
