import React from 'react'
import cls from 'classnames'
import { daysSinceLastPush } from '@/utils/misc'

export default function Dot(props) {
  return (
    <span className={cls("dot", props.className, {
      hot: daysSinceLastPush(props.date) <= 7,
      new: daysSinceLastPush(props.date) <= 30,
      old: daysSinceLastPush(props.date) > 180,
    })} />
  )
}
