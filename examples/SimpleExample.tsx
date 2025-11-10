import React from 'react'
import { Scrollbars } from '../src'

export default function SimpleExample() {
  return (
    <div style={{ width: 500, height: 300 }}>
      <Scrollbars>
        <div style={{ padding: 20 }}>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>
              This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur 
              adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
      </Scrollbars>
    </div>
  )
}