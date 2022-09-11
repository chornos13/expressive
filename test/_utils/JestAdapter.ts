function useFakeTimers() {
  jest.useFakeTimers({
    doNotFake: [
      // 'Date',
      // 'hrtime',
      // 'performance',
      // 'queueMicrotask',
      // 'requestAnimationFrame',
      // 'cancelAnimationFrame',
      // 'requestIdleCallback',
      // 'cancelIdleCallback',
      // 'clearImmediate',
      // 'setInterval',
      // 'clearInterval',
      // 'setTimeout',
      // 'clearTimeout',
      'nextTick',
      'setImmediate',
    ],
  })
}

export default {
  useFakeTimers,
}
