package util

import "fmt"

func ShouldBlock(actual interface{}, expected ...interface{}) string {
	channel, actualIsChannel := actual.(chan struct{})

	if !actualIsChannel {
		return fmt.Sprintf("%v should be a channel", actual)
	}

	select {
	case msg := <-channel:
		return fmt.Sprintf("%v did not block, but received %v", channel, msg)
	default:
		return ""
	}
}

func ShouldNotBlock(actual interface{}, expected ...interface{}) string {
	channel, actualIsChannel := actual.(chan struct{})

	if !actualIsChannel {
		return fmt.Sprintf("%v should be a channel", actual)
	}

	select {
	case <-channel:
		return ""
	default:
		return fmt.Sprintf("%v did block", channel)
	}

}
