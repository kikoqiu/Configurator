/* eslint-disable */
import BT from "./bluetooth";

interface SerialOptions {
    baudRate: number;
    dataBits: number;
    stopBits: number;
    parity: any;
    bufferSize: number;
    rtscts: boolean;
    xon: boolean;
    xoff: boolean;
    xany: boolean;
  }
  
class BtEndpointUnderlyingSource implements UnderlyingSource<Uint8Array> {
    private onError_: () => void;
    constructor() {
      this.onError_=()=>{};
    }
    async pull(controller: ReadableStreamDefaultController): Promise<void> {
        const chunkSize = controller.desiredSize || 64;
        try {
            for (;BT.connected ;) {
                let result = await BT.read(chunkSize);
                if (result?.data && result.data.byteLength > 0) {
                controller.enqueue(result.data);
                break;
                } else {
                await new Promise((res, _) => setTimeout(res, 10, 0));
                }
            }
        }
        catch (error) {
            controller.error(error.toString());
            this.onError_();
        }
    }
}

class BTEndpointUnderlyingSink implements UnderlyingSink<Uint8Array> {
    private onError_: () => void;

    constructor() {
    }

    async write(
        chunk: Uint8Array,
        controller: WritableStreamDefaultController): Promise<void> {
      for(let w = 0;w < chunk.length;){
        let tw = chunk.length-w;
        if(tw > 200)tw = 200;
        try {
          const result = await BT.send(chunk.subarray(w,w + tw));        
        } catch (error) {
          controller.error(error);
          this.onError_();
          break;
        }
        w += tw;
      }
    }
}


export default class BtSerialPort {
    private readable_: ReadableStream<Uint8Array> | null;
    private writable_: WritableStream<Uint8Array> | null;
    private device_:any;
     
  
    public constructor(device :any
      ) {
        this.device_=device;
    }
  
    /**
     * Getter for the readable attribute. Constructs a new ReadableStream as
     * necessary.
     * @return {ReadableStream} the current readable stream
     */
    public get readable(): ReadableStream<Uint8Array> | null {
      if (!this.readable_ && BT.connected) {
        this.readable_ = new ReadableStream(
            new BtEndpointUnderlyingSource(),
            new ByteLengthQueuingStrategy({
              highWaterMark: 255,
            }));
      }
      return this.readable_;
    }
  
    /**
     * Getter for the writable attribute. Constructs a new WritableStream as
     * necessary.
     * @return {WritableStream} the current writable stream
     */
    public get writable(): WritableStream<Uint8Array> | null {
      if (!this.writable_ && BT.connected) {
        this.writable_ = new WritableStream(
            new BTEndpointUnderlyingSink(),
            new ByteLengthQueuingStrategy({
              highWaterMark: 255,
            }));
      }
      return this.writable_;
    }
  
    /**
     * a function that opens the device and claims all interfaces needed to
     * control and communicate to and from the serial device
     * @param {SerialOptions} options Optional object containing serial options
     * @return {Promise<void>} A promise that will resolve when device is ready
     * for communication
     */
    public async open(options?: SerialOptions): Promise<void> {
        await BT.connect(this.device_.path,options);
    }
  
    /**
     * Closes the port.
     *
     * @return {Promise<void>} A promise that will resolve when the port is
     * closed.
     */
    public async close(): Promise<void> {
      let promises = [] as Promise<void>[];
      if (this.readable_) {
        promises.push(this.readable_.cancel());
      }
      if (this.writable_) {
        promises.push(this.writable_.abort());
      }
      await Promise.all(promises);
      this.readable_ = null;
      this.writable_ = null;
      if (BT.connected) {
        await this.setSignals({dtr: false, rts: false});
        await BT.disconnect();
      }
    }
  

    public getInfo(): any {
      return {
        usbVendorId: this.device_.vendorId,
        usbProductId: this.device_.productId,
      };
    }
  

    public async reconfigure(options: SerialOptions) {      
    }
  

    public async setSignals(signals: any) {
      
    }
  
  }