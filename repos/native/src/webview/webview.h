#ifndef WEBVIEW_H
#define WEBVIEW_H

#include <gtk/gtk.h>
#include <webkit2/webkit2.h>

void webview_bind_function(WebKitWebView *webview, const char *name);

#endif
