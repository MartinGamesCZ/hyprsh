package webview

/*
#cgo pkg-config: gtk+-3.0 webkit2gtk-4.0 gtk-layer-shell-0
#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
#include <gtk-layer-shell.h>
#include <stdlib.h>
#include "webview.h"
*/
import "C"
import (
	"sync"
	"unsafe"
)

type GtkWidget = *C.GtkWidget
type BindCallback func(string)

var (
	callbacksMu sync.RWMutex
	callbacks   = make(map[string]BindCallback)
)

//export go_script_message_received
func go_script_message_received(cHandlerName *C.char, cMessage *C.char) {
	handlerName := C.GoString(cHandlerName)
	message := C.GoString(cMessage)

	callbacksMu.RLock()
	cb, exists := callbacks[handlerName]
	callbacksMu.RUnlock()

	if exists && cb != nil {
		cb(message)
	}
}

func BindFunction(webview GtkWidget, name string, callback BindCallback) {
	callbacksMu.Lock()
	callbacks[name] = callback
	callbacksMu.Unlock()

	cName := C.CString(name)
	defer C.free(unsafe.Pointer(cName))

	C.webview_bind_function((*C.WebKitWebView)(unsafe.Pointer(webview)), cName)
}

func CreateWebview() GtkWidget {
	return C.webkit_web_view_new()
}

func SetWebviewBackground(webview GtkWidget) {
	rgba := C.GdkRGBA{0, 0, 0, 0}
	C.webkit_web_view_set_background_color((*C.WebKitWebView)(unsafe.Pointer(webview)), &rgba)
}

func AllowAccessToLocalFiles(webview GtkWidget) {
	settings := C.webkit_web_view_get_settings((*C.WebKitWebView)(unsafe.Pointer(webview)))

	// Allow access to local files
	C.webkit_settings_set_allow_file_access_from_file_urls(settings, C.TRUE)
	C.webkit_settings_set_allow_universal_access_from_file_urls(settings, C.TRUE)
}

func LoadURI(webview GtkWidget, url string) {
	cUrl := C.CString(url)
	defer C.free(unsafe.Pointer(cUrl))
	C.webkit_web_view_load_uri((*C.WebKitWebView)(unsafe.Pointer(webview)), cUrl)
}
