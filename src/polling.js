module.exports = {
  /**
   * Inits the polling logic
   */
  initPolling () {
    // Cleanup old interval
    if (this.data.pollingInterval) {
      clearInterval(this.data.pollingInterval)
    }

    // Setup polling if enabled and host is set
    if (this.config.enable_polling && this.config.host) {
      this.log('debug', `Polling ${this.socket.host} started...`)

      this.data.pollingInterval = setInterval(() => {
        // Send Input Gain Query
        this.sendTCP('!ingn(*)?\n', false)

        // Send Input Mute Query
        this.sendTCP('!inmt(*)?\n', false)

        // Send Output Gain Query
        this.sendTCP('!outgn(*)?\n', false)

        // Send Output Mute Query
        this.sendTCP('!outmt(*)?\n', false)

        // Send Rear Panel Input Gain Query
        this.sendTCP('!rpingn(*)?\n', false)

        // Send Rear Panel Input Gain Query
        this.sendTCP('!rpoutgn(*)?\n', false)
      }, this.config.polling_rate)
    }
  }
}
