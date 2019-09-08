package controller

type Vector [3]float32

type SilverwareRates struct {
	MaxRate   Vector `cbor:"max_rate"`
	AngleExpo Vector `cbor:"angle_expo"`
	AcroExpo  Vector `cbor:"acro_expo"`
}

type BetaflightRates struct {
	RcRate    Vector `cbor:"rc_rate"`
	SuperRate Vector `cbor:"super_rate"`
	Expo      Vector `cbor:"expo"`
}

type Rates struct {
	Mode              uint8           `cbor:"mode"`
	Silverware        SilverwareRates `cbor:"silverware"`
	Betaflight        BetaflightRates `cbor:"betaflight"`
	LevelMaxAngle     float32         `cbor:"level_max_angle"`
	LowRateMulitplier float32         `cbor:"low_rate_mulitplier"`
	SticksDeadband    float32         `cbor:"sticks_deadband"`
}

type PIDRates struct {
	KP Vector `cbor:"kp"`
	KI Vector `cbor:"ki"`
	KD Vector `cbor:"kd"`
}

type Motor struct {
	InvertYaw uint8 `cbor:"invert_yaw"`
}

type Voltage struct {
	LipoCellCount            uint8   `cbor:"lipo_cell_count"`
	PidVoltageCompensation   uint8   `cbor:"pid_voltage_compensation"`
	VBattLow                 float32 `cbor:"vbattlow"`
	ActualBatteryVoltage     float32 `cbor:"actual_battery_voltage"`
	ReportedTelemetryVoltage float32 `cbor:"reported_telemetry_voltage"`
}

type Channel struct {
	Aux []uint `cbor:"aux"`
}

type Profile struct {
	Channel Channel  `cbor:"channel"`
	Motor   Motor    `cbor:"motor"`
	Voltage Voltage  `cbor:"voltage"`
	Rate    Rates    `cbor:"rate"`
	PID     PIDRates `cbor:"pid"`
}
