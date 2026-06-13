#include "webview.h"
#include "glib-object.h"
#include "glib.h"
#include "jsc/jsc.h"
#include "webkit/WebKitUserContentManager.h"
#include <gtk/gtk.h>
#include <webkit2/webkit2.h>

// Forward declaration of Go export function
extern void go_script_message_received(char *handler_name, char *message);

static void message_received_cb(WebKitUserContentManager *manager,
                                WebKitJavascriptResult *result,
                                gpointer user_data) {
  char *handler_name = (char *)user_data;
  JSCValue *value = webkit_javascript_result_get_js_value(result);
  char *message_str = jsc_value_to_string(value);

  go_script_message_received(handler_name, message_str);
  g_free(message_str);
}

void webview_bind_function(WebKitWebView *webview, const char *name) {
  WebKitUserContentManager *manager =
      webkit_web_view_get_user_content_manager(webview);

  char *handler_name = g_strdup(name);
  gchar *signal_name = g_strdup_printf("script-message-received::%s", name);
  g_signal_connect_data(manager, signal_name, G_CALLBACK(message_received_cb),
                        handler_name, (GClosureNotify)g_free, 0);
  g_free(signal_name);

  webkit_user_content_manager_register_script_message_handler(manager, name);

  gchar *js =
      g_strdup_printf("if (!window.hyprsh) window.hyprsh = {};"
                      "window.hyprsh.%s = (arg) => {"
                      "  let payload;"
                      "  if (arg === undefined) payload = '';"
                      "  else if (typeof arg === 'string') payload = arg;"
                      "  else payload = JSON.stringify(arg);"
                      "  window.webkit.messageHandlers.%s.postMessage(payload);"
                      "};",
                      name, name);

  WebKitUserScript *script = webkit_user_script_new(
      js, WEBKIT_USER_CONTENT_INJECT_ALL_FRAMES,
      WEBKIT_USER_SCRIPT_INJECT_AT_DOCUMENT_START, NULL, NULL);

  webkit_user_content_manager_add_script(manager, script);
  webkit_user_script_unref(script);
  g_free(js);
}
