package window

import (
	"unsafe"

	"hyprsh.martinpetr.dev/src/config"
	"hyprsh.martinpetr.dev/src/gtkc"
	"hyprsh.martinpetr.dev/src/system"
	"hyprsh.martinpetr.dev/src/webview"
)

type Window struct {
	gtkWindow *gtkc.GtkWidget
	webview   webview.GtkWidget
}

func (w *Window) Init() {
	gtkc.GtkInit()
	gtkc.GtkPreferDarkTheme()
}

func (w *Window) Create() {
	w.gtkWindow = gtkc.GtkWindowNewToplevel()
	w.webview = webview.CreateWebview()

	sw, sh := system.GetScreenSize()

	gtkc.GtkcApplyTransparencyVisual(w.gtkWindow)
	gtkc.GtkWidgetSetAppPaintable(w.gtkWindow)
	gtkc.GtkcSetLayerShell(w.gtkWindow)
	gtkc.GtkcSetNamespace(w.gtkWindow, config.ProjectNamespace)

	// Set window position, size, exclusive zone and input region
	// These all combine so that we have our window that has two areas:
	// 1. The whole window where we can render elements - does not have input region coverage
	// 		so that we can interact with the windows under it
	// 2. The taskbar itself, which has smaller size and exclusive zone
	gtkc.GtkcSetAnchorAndSize(w.gtkWindow, sw, sh)
	gtkc.GtkcSetExclusiveZone(w.gtkWindow, config.TaskbarHeight)
	// Set input region -- the +10 pixels are there to allow the window to detect de-hover
	gtkc.GtkcSetInputRegion(w.gtkWindow, 0, 0, sw, config.TaskbarHeight+10)

	webview.SetWebviewBackground(w.webview)
	webview.AllowAccessToLocalFiles(w.webview)

	webview.BindFunction(w.webview, "requestInputRegionExpand", func(msg string) {
		if msg == "true" {
			gtkc.GtkcSetInputRegion(w.gtkWindow, 0, 0, sw, sh)
		} else {
			gtkc.GtkcSetInputRegion(w.gtkWindow, 0, 0, sw, config.TaskbarHeight+10)
		}
	})

	gtkc.GtkContainerAdd(w.gtkWindow, (*gtkc.GtkWidget)(unsafe.Pointer(w.webview)))

	webview.LoadURI(w.webview, "http://127.99.22.16:3000/taskbar")

	gtkc.GtkWindowShow(w.gtkWindow)
	gtkc.GtkMain()
}
