const TCP = require('../../../tcp')

module.exports = {
  /**
   * Inits the TCP connection and updates status
   */
  initTCP () {
    if (this.socket !== undefined) {
      this.socket.destroy()
      delete this.socket
    }

    if (this.config.host) {
      this.debug('Initiating socket...')
      this.socket = new TCP(this.config.host, this.config.port)

      this.socket.on('status_change', (status, message) => {
        this.status(status, message)
      })

      this.socket.on('error', (err) => {
        this.debug('Network error', err)
        this.log('error', 'Network error: ' + err.message)
      })

      let buffer = ''

      this.socket.on('data', data => {
        buffer += data.toString()
        if (buffer.endsWith('\r\n')) {
          buffer
            .split('\r\n')
            .filter(message => message !== '')
            .forEach(message => this.processData(message.trim()))
          buffer = ''
        }
      })
    }
  },

  /**
   * Sends a TCP Package
   *
   * @param {string} payload The actual payload string for the connected device
   * @param {bool} log When false, skip logging. (To prevent flooding logs by polling)
   */
  sendTCP (payload, log = true) {
    if (log) {
      this.log('debug', `Sending ${payload} to ${this.socket.host}...`)
    }

    this.socket.send(payload)
  },

  /**
   * Parses and processes the response from the device and updates variables
   *
   * Example message: OK ingn(3)=45
   * Example message: OK inmt(*)={1,1,0,1,1,0,1,0,1,1,0,0,0,0,0,1,0,0,0,0}
   *
   * @param {string} message The return message from the device
   */
  processData (message) {
    const [, status, command, channel, value] = /(OK|ERROR)(?: (.*)\((.*)\)=(.*))?/.exec(message)

    if (status === 'ERROR') {
      this.status(this.STATUS_ERROR)
      this.log('warning', `ERROR received in TCP stream from ${this.socket.host}...`)
      return
    }

    if (status === 'OK') {
      this.status(this.STATUS_OK)

      // If return output is about multiple channels, process as array
      if (channel === '*') {
        const values = value
          .substring(1, value.length - 1)
          .split(',')

        // First channel is 1, first value in array is 0...
        for (let i = 0; i < values.length; i++) {
          this.processVariable(command, i + 1, values[i])
        }
      }

      // If return output is about a single channel, process as single
      if (Number(channel)) {
        this.processVariable(command, Number(channel), value)
      }
    }
  }
}
