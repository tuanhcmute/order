import React from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui'
import { useCartItemStore } from '@/stores'
import { ICartItem } from '@/types'

interface QuantitySelectorProps {
  cartItem: ICartItem
}

export default function QuantitySelector({ cartItem }: QuantitySelectorProps) {
  console.log(cartItem)
  const [quantity, setQuantity] = React.useState(cartItem.quantity)
  const { updateCartItemQuantity } = useCartItemStore()

  const handleIncrement = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1
      updateCartItemQuantity(cartItem.id, newQuantity)
      return newQuantity
    })
  }

  const handleDecrement = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(prev - 1, 1)
      updateCartItemQuantity(cartItem.id, newQuantity)
      return newQuantity
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        className="p-1 border rounded-full w-fit h-fit hover:bg-gray-100"
      >
        <Minus size={12} />
      </Button>
      <span className="w-4 text-xs text-center">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        className="p-1 border rounded-full w-fit h-fit hover:bg-gray-100"
      >
        <Plus size={12} />
      </Button>
    </div>
  )
}