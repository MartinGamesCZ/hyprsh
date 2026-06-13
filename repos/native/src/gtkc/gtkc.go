package gtkc

/*
#cgo pkg-config: gtk+-3.0 webkit2gtk-4.0 gtk-layer-shell-0
#include "gtkc.h"
*/
import "C"
import "unsafe"

type GtkWidget C.GtkWidget

func GtkInit() {
	C.gtk_init(nil, nil)
}

func GtkPreferDarkTheme() {
	C.gtkc_prefer_dark_theme()
}

func GtkWindowNewToplevel() *GtkWidget {
	return (*GtkWidget)(C.gtk_window_new(C.GTK_WINDOW_TOPLEVEL))
}

func GtkMain() {
	C.gtk_main()
}

func GtkContainerAdd(container *GtkWidget, child *GtkWidget) {
	C.gtk_container_add((*C.GtkContainer)(unsafe.Pointer(container)), (*C.GtkWidget)(child))
}

func GtkWidgetSetAppPaintable(window *GtkWidget) {
	C.gtk_widget_set_app_paintable((*C.GtkWidget)(window), C.TRUE)
}

func GtkWindowShow(window *GtkWidget) {
	C.gtk_widget_show_all((*C.GtkWidget)(window))
}

func GtkcApplyTransparencyVisual(window *GtkWidget) {
	screen := C.gtk_widget_get_screen((*C.GtkWidget)(window))
	visual := C.gdk_screen_get_rgba_visual(screen)

	if visual != nil {
		C.gtk_widget_set_visual((*C.GtkWidget)(window), visual)
	}
}

func GtkcSetLayerShell(window *GtkWidget) {
	display := C.gdk_display_get_default()
	monitor := C.gdk_display_get_monitor(display, 0)

	C.gtk_layer_init_for_window((*C.GtkWindow)(unsafe.Pointer(window)))

	if monitor != nil {
		C.gtk_layer_set_monitor((*C.GtkWindow)(unsafe.Pointer(window)), monitor)
	}

	C.gtk_layer_set_layer((*C.GtkWindow)(unsafe.Pointer(window)), C.GTK_LAYER_SHELL_LAYER_TOP)

}

func GtkcSetNamespace(window *GtkWidget, namespace string) {
	cNS := C.CString(namespace)
	C.gtk_layer_set_namespace((*C.GtkWindow)(unsafe.Pointer(window)), cNS)
	C.free(unsafe.Pointer(cNS))
}

func GtkcSetAnchorAndSize(window *GtkWidget, w, h int) {
	C.gtk_layer_set_anchor((*C.GtkWindow)(unsafe.Pointer(window)), C.GTK_LAYER_SHELL_EDGE_TOP, 1)
	C.gtk_layer_set_anchor((*C.GtkWindow)(unsafe.Pointer(window)), C.GTK_LAYER_SHELL_EDGE_LEFT, 0)
	C.gtk_layer_set_anchor((*C.GtkWindow)(unsafe.Pointer(window)), C.GTK_LAYER_SHELL_EDGE_RIGHT, 0)

	C.gtk_widget_set_size_request((*C.GtkWidget)(window), C.int(w), C.int(h))
}

func GtkcSetExclusiveZone(window *GtkWidget, h int) {
	C.gtk_layer_set_exclusive_zone((*C.GtkWindow)(unsafe.Pointer(window)), C.int(h))
}

func GtkcSetInputRegion(window *GtkWidget, x, y, w, h int) {
	C.gtkc_set_input_region((*C.GtkWidget)(window), C.int(x), C.int(y), C.int(w), C.int(h))
}
