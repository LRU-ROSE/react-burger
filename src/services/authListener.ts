import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { TypedStartListening } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from './index'

export const authListenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAuthListening =
authListenerMiddleware.startListening as AppStartListening
