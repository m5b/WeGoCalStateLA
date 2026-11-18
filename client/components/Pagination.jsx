import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Colors } from "../constant/Colors";
import { pageWindow } from "../utils/pageWindow";

// Page numbers with Previous / Next arrows, like the bottom of a Google search:
//   < Previous  1  2  3  ...  13  Next >
//   page        the current page (starting at 1)
//   totalPages  how many pages there are (nothing is shown for 1 page or fewer)
//   onChange    (page) => void
export default function Pagination({ page, totalPages, onChange }) {
  const { width } = useWindowDimensions();
  if (!totalPages || totalPages <= 1) return null;
  const compact = width < 520; // on a phone the arrows lose their words so the numbers fit
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <View style={styles.row} accessibilityRole="navigation">
      <TouchableOpacity
        onPress={() => onChange(page - 1)}
        disabled={atStart}
        accessibilityLabel="Previous page"
        style={[styles.arrow, atStart && styles.disabled]}
      >
        <ChevronLeft size={18} color={atStart ? Colors.GRAY : Colors.PRIMARY} />
        {compact ? null : <Text style={[styles.arrowText, atStart && styles.disabledText]}>Previous</Text>}
      </TouchableOpacity>

      {pageWindow(page, totalPages).map((item, index) =>
        item === "…" ? (
          <Text key={`gap-${index}`} style={styles.gap}>…</Text>
        ) : (
          <TouchableOpacity
            key={item}
            onPress={() => onChange(item)}
            accessibilityLabel={`Page ${item}`}
            accessibilityState={{ selected: item === page }}
            style={[styles.number, item === page && styles.numberActive]}
          >
            <Text style={[styles.numberText, item === page && styles.numberTextActive]}>{item}</Text>
          </TouchableOpacity>
        )
      )}

      <TouchableOpacity
        onPress={() => onChange(page + 1)}
        disabled={atEnd}
        accessibilityLabel="Next page"
        style={[styles.arrow, atEnd && styles.disabled]}
      >
        {compact ? null : <Text style={[styles.arrowText, atEnd && styles.disabledText]}>Next</Text>}
        <ChevronRight size={18} color={atEnd ? Colors.GRAY : Colors.PRIMARY} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
  },
  arrow: { flexDirection: "row", alignItems: "center", gap: 2, paddingHorizontal: 8, paddingVertical: 8 },
  arrowText: { color: Colors.PRIMARY, fontWeight: "700", fontSize: 14 },
  disabled: { opacity: 0.5 },
  disabledText: { color: Colors.GRAY },
  number: { minWidth: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  numberActive: { backgroundColor: Colors.PRIMARY },
  numberText: { color: Colors.PRIMARY, fontWeight: "700", fontSize: 14 },
  numberTextActive: { color: Colors.WHITE },
  gap: { color: Colors.TEXT_MUTED, paddingHorizontal: 4, fontSize: 16 },
});