{
  "screen_id": "DashboardSummaryWithChart_v1",
  "page": {
    "background_color_token": "--background",
    "text_color_token": "--foreground",
    "padding_horizontal_px": 24,
    "padding_vertical_px": 24,
    "max_width_px": 960,
    "layout": "centered_column"
  },

  "sections": [
    {
      "section_id": "summary_cards_row",
      "type": "card_row",
      "margin_bottom_px": 24,
      "layout": {
        "display": "grid",
        "columns_by_breakpoint": {
          "sm": 1,
          "md": 2,
          "lg": 4
        },
        "column_gap_px": 16,
        "row_gap_px": 16
      },
      "cards": [
        {
          "card_id": "card_total_revenue",
          "background_color_token": "--card",
          "text_color_token": "--card-foreground",
          "border_color_token": "--border",
          "border_width_px": 1,
          "border_radius_token": "--radius-lg",
          "shadow_token": "--shadow-sm",
          "padding_all_px": 16,
          "content": {
            "title": {
              "text_role": "label",
              "font_size_px": 14,
              "font_weight": 500,
              "color_token": "--muted-foreground",
              "margin_bottom_px": 4
            },
            "value": {
              "text_role": "main_metric",
              "font_size_px": 28,
              "font_weight": 600,
              "color_token": "--foreground",
              "margin_bottom_px": 4
            },
            "subtext": {
              "text_role": "secondary_text",
              "font_size_px": 14,
              "font_weight": 400,
              "color_token": "--muted-foreground"
            }
          }
        },
        {
          "card_id": "card_new_customers",
          "same_as": "card_total_revenue"
        },
        {
          "card_id": "card_active_accounts",
          "same_as": "card_total_revenue"
        },
        {
          "card_id": "card_growth_rate",
          "same_as": "card_total_revenue"
        }
      ]
    },

    {
      "section_id": "main_chart_card",
      "type": "card_chart",
      "layout": {
        "display": "block"
      },
      "card": {
        "background_color_token": "--card",
        "text_color_token": "--card-foreground",
        "border_color_token": "--border",
        "border_width_px": 1,
        "border_radius_token": "--radius-lg",
        "shadow_token": "--shadow-sm",
        "padding_all_px": 16
      },
      "content": {
        "header": {
          "layout": {
            "display": "flex",
            "justify_content": "space-between",
            "align_items": "center",
            "margin_bottom_px": 16
          },
          "title": {
            "text_role": "card_title",
            "font_size_px": 16,
            "font_weight": 600,
            "color_token": "--foreground"
          },
          "subtitle": {
            "text_role": "card_subtitle",
            "font_size_px": 14,
            "font_weight": 400,
            "color_token": "--muted-foreground"
          },
          "actions": {
            "type": "single_select",
            "optional": true,
            "control_height_px": 32,
            "background_color_token": "--card",
            "border_color_token": "--border",
            "text_color_token": "--foreground",
            "border_radius_token": "--radius-md",
            "horizontal_padding_px": 12,
            "font_size_px": 14
          }
        },

        "chart_area": {
          "height_px": 260,
          "margin_bottom_px": 8,
          "chart_type": "area",
          "gridline_color_token": "--border",
          "axis_label_color_token": "--muted-foreground",
          "series": [
            {
              "series_id": "visitors_main",
              "color_token": "--chart-1",
              "thickness_px": 2,
              "fill_opacity": 0.30
            },
            {
              "series_id": "visitors_secondary",
              "color_token": "--chart-2",
              "thickness_px": 2,
              "fill_opacity": 0.20
            }
          ]
        },

        "footer": {
          "layout": {
            "display": "flex",
            "justify_content": "space-between",
            "align_items": "center",
            "margin_top_px": 8
          },
          "primary_text": {
            "text_role": "trend_text",
            "font_size_px": 14,
            "font_weight": 500,
            "color_token": "--foreground"
          },
          "secondary_text": {
            "text_role": "helper_text",
            "font_size_px": 12,
            "font_weight": 400,
            "color_token": "--muted-foreground"
          }
        }
      }
    }
  ],

  "global_rules": {
    "card_title_spacing_px": 4,
    "card_vertical_content_spacing_px": 8,
    "card_row_to_next_section_spacing_px": 24,
    "font_family_sans_token": "--font-sans",
    "corner_radius_for_buttons_token": "--radius-md",
    "corner_radius_for_cards_token": "--radius-lg",
    "shadow_for_interactive_cards_token": "--shadow-sm",
    "shadow_for_popovers_token": "--shadow-md",
    "hover_rule_cards": {
      "elevation_shadow_token": "--shadow-md",
      "background_color_token": "--card"
    }
  }
}
