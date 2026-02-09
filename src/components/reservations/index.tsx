import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AuthContainer from "../ui/AuthContainer";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// ──────────────────────────────────────────────
// Tipagens
// ──────────────────────────────────────────────
type ReservationStatus = "confirmada" | "pendente" | "cancelada" | "checkin" | "checkout";

interface Reservation {
  id: string;
  code: string; // ex: RSV-00123
  guestName: string;
  room: string;
  checkin: string;  // ISO
  checkout: string; // ISO
  status: ReservationStatus;
  total: number;    // em BRL
  createdAt: string; // ISO
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const fmtDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
};

const fmtMoney = (n: number) =>
  (n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusMeta: Record<
  ReservationStatus,
  { label: string; color: string; bg: string; icon: keyof typeof MaterialIcons.glyphMap }
> = {
  confirmada: { label: "Confirmada", color: "#155724", bg: "#d4edda", icon: "check-circle" },
  pendente:   { label: "Pendente",   color: "#856404", bg: "#fff3cd", icon: "hourglass-top" },
  cancelada:  { label: "Cancelada",  color: "#721c24", bg: "#f8d7da", icon: "cancel" },
  checkin:    { label: "Check-in",   color: "#0c5460", bg: "#d1ecf1", icon: "login" },
  checkout:   { label: "Check-out",  color: "#0c5460", bg: "#d1ecf1", icon: "logout" },
};

// Simula ID
const uid = () => Math.random().toString(36).slice(2, 10);

// Simula atraso de rede
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ──────────────────────────────────────────────
async function apiListReservations(page: number, pageSize: number): Promise<{ data: Reservation[]; hasMore: boolean }> {
  await wait(600);
  // Mock
  const base: Reservation[] = new Array(pageSize).fill(null).map((_, i) => {
    const idx = (page - 1) * pageSize + i + 1;
    const today = new Date();
    const in2 = new Date(today); in2.setDate(today.getDate() + 2);
    const in5 = new Date(today); in5.setDate(today.getDate() + 5);

    const statusPool: ReservationStatus[] = ["confirmada", "pendente", "cancelada", "checkin", "checkout"];
    const st = statusPool[idx % statusPool.length];

    return {
      id: uid(),
      code: `RSV-${String(idx).padStart(5, "0")}`,
      guestName: ["Maria Silva", "João Pedro", "Ana Costa", "Renato Luz", "Beatriz Melo"][idx % 5],
      room: `#${100 + (idx % 20)}`,
      checkin: today.toISOString(),
      checkout: (idx % 2 ? in2 : in5).toISOString(),
      status: st,
      total: 350 + (idx % 4) * 90,
      createdAt: today.toISOString(),
    };
  });

  // Limita a 3 páginas na simulação
  const hasMore = page < 1;
  return { data: base, hasMore };
}

async function apiCreateReservation(payload: Omit<Reservation, "id" | "code" | "createdAt">): Promise<Reservation> {
  await wait(700);
  return {
    ...payload,
    id: uid(),
    code: `RSV-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
    createdAt: new Date().toISOString(),
  };
}

async function apiUpdateReservation(id: string, patch: Partial<Reservation>): Promise<Reservation> {
  await wait(500);
  // No mock, apenas retorna mesclado
  return {
    id,
    code: `RSV-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
    guestName: patch.guestName || "Hóspede",
    room: patch.room || "#000",
    checkin: patch.checkin || new Date().toISOString(),
    checkout: patch.checkout || new Date().toISOString(),
    status: (patch.status as ReservationStatus) || "pendente",
    total: patch.total ?? 0,
    createdAt: new Date().toISOString(),
  };
}

async function apiDeleteReservation(id: string): Promise<void> {
  await wait(500);
  return;
}

// Normaliza "yyyy-MM-dd" para ISO (meia-noite local)
function normalizeToISO(s: string): string {
  const parts = s.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map((p) => Number(p));
    const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0); // 12h para evitar fuso problemático
    return dt.toISOString();
  }
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
const RenderReservations = () => {
  // Listagem
  const [items, setItems] = useState<Reservation[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // UI state
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Busca & Filtro
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "todos">("todos");

  // Modal (criar/editar)
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);

  // Form da reserva
  const [guestName, setGuestName] = useState("");
  const [room, setRoom] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [status, setStatus] = useState<ReservationStatus>("pendente");
  const [total, setTotal] = useState<string>("");

  const resetForm = () => {
    setGuestName("");
    setRoom("");
    setCheckin("");
    setCheckout("");
    setStatus("pendente");
    setTotal("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (res: Reservation) => {
    setEditing(res);
    setGuestName(res.guestName);
    setRoom(res.room);
    setCheckin(res.checkin);
    setCheckout(res.checkout);
    setStatus(res.status);
    setTotal(String(res.total));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Carregar inicial
  useEffect(() => {
    (async () => {
      try {
        const { data, hasMore } = await apiListReservations(1, 5);
        setItems(data);
        setHasMore(hasMore);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data, hasMore } = await apiListReservations(1, 10);
      setItems(data);
      setPage(1);
      setHasMore(hasMore);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load more
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { data, hasMore: hm } = await apiListReservations(next, 10);
      setItems((prev) => [...prev, ...data]);
      setPage(next);
      setHasMore(hm);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  // Busca/Filtro
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const matchesQuery =
        !q ||
        r.guestName.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "todos" ? true : r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  // Validação do form
  const formErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!guestName.trim()) e.guestName = "Informe o nome do hóspede";
    if (!room.trim()) e.room = "Informe o número do quarto";
    if (!checkin) e.checkin = "Informe o check-in (ISO: yyyy-MM-dd)";
    if (!checkout) e.checkout = "Informe o check-out (ISO: yyyy-MM-dd)";
    if (checkin && checkout && new Date(checkin) > new Date(checkout)) {
      e.checkout = "Check-out deve ser após o check-in";
    }
    const value = Number(total.replace(",", "."));
    if (Number.isNaN(value) || value < 0) e.total = "Total inválido";
    return e;
  }, [guestName, room, checkin, checkout, total]);

  const canSubmit = Object.keys(formErrors).length === 0;

  // Criar/Atualizar
  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const payload = {
        guestName: guestName.trim(),
        room: room.trim(),
        checkin: normalizeToISO(checkin),
        checkout: normalizeToISO(checkout),
        status,
        total: Number(total.replace(",", ".")),
      } as Omit<Reservation, "id" | "code" | "createdAt">;

      if (editing) {
        const updated = await apiUpdateReservation(editing.id, payload as Partial<Reservation>);
        setItems((prev) => prev.map((it) => (it.id === editing.id ? { ...updated, id: editing.id } : it)));
        Alert.alert("Sucesso", "Reserva atualizada!");
      } else {
        const created = await apiCreateReservation(payload);
        setItems((prev) => [created, ...prev]);
        Alert.alert("Sucesso", "Reserva criada!");
      }
      closeModal();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a reserva.");
    }
  };

  // Excluir
  const confirmDelete = (res: Reservation) => {
    Alert.alert("Excluir reserva", `Tem certeza que deseja excluir ${res.code}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await apiDeleteReservation(res.id);
            setItems((prev) => prev.filter((it) => it.id !== res.id));
            Alert.alert("Pronto", "Reserva excluída.");
          } catch {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  };

  // Render
  return (
    <AuthContainer>
      {/* Topbar: Busca e filtro */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Buscar por hóspede, reserva ou quarto..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Limpar busca">
              <MaterialIcons name="close" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filtersRow}>
          {(["todos", "confirmada", "pendente", "checkin", "checkout", "cancelada"] as const).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setStatusFilter(key)}
              style={[
                styles.chip,
                statusFilter === key && { backgroundColor: "#673AB7" },
              ]}
            >
              <Text style={[styles.chipText, statusFilter === key && { color: "#FFF", fontWeight: "700" }]}>
                {key === "todos" ? "Todos" : statusMeta[key].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista */}
      {initialLoading ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReservationCard
              item={item}
              onEdit={() => openEdit(item)}
              onDelete={() => confirmDelete(item)}
            />
          )}
          ListEmptyComponent={<EmptyState onCreate={openCreate} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <ActivityIndicator color="#673AB7" />
              </View>
            ) : null
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openCreate} accessibilityLabel="Criar reserva">
        <MaterialIcons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Modal criação/edição */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editing ? "Editar Reserva" : "Nova Reserva"}</Text>
              <TouchableOpacity onPress={closeModal}>
                <MaterialIcons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <InputRow
              label="Hóspede"
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Nome do hóspede"
              error={formErrors.guestName}
            />
            <InputRow
              label="Quarto"
              value={room}
              onChangeText={setRoom}
              placeholder="Ex.: #203"
              error={formErrors.room}
            />
            <InputRow
              label="Check-in"
              value={checkin}
              onChangeText={setCheckin}
              placeholder="yyyy-MM-dd"
              error={formErrors.checkin}
              keyboardType="numbers-and-punctuation"
            />
            <InputRow
              label="Check-out"
              value={checkout}
              onChangeText={setCheckout}
              placeholder="yyyy-MM-dd"
              error={formErrors.checkout}
              keyboardType="numbers-and-punctuation"
            />

            {/* Status picker simples */}
            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                {(["pendente", "confirmada", "checkin", "checkout", "cancelada"] as ReservationStatus[]).map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setStatus(s)}
                    style={[
                      styles.stChip,
                      status === s && { backgroundColor: statusMeta[s].bg, borderColor: statusMeta[s].color },
                    ]}
                  >
                    <MaterialIcons name={statusMeta[s].icon} size={16} color={statusMeta[s].color} />
                    <Text style={[styles.stChipText, { color: statusMeta[s].color }]}>{statusMeta[s].label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <InputRow
              label="Total (R$)"
              value={total}
              onChangeText={setTotal}
              placeholder="0,00"
              error={formErrors.total}
              keyboardType="decimal-pad"
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={closeModal}>
                <Text style={styles.secondaryBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text style={styles.primaryBtnText}>{editing ? "Salvar" : "Criar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AuthContainer>
  );
};

// ──────────────────────────────────────────────
// Subcomponentes
// ──────────────────────────────────────────────
const ReservationCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: Reservation;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const meta = statusMeta[item.status];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <FontAwesome5 name="file-invoice" size={16} color="#673AB7" />
          <Text style={styles.code}>{item.code}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: meta.bg }]}>
          <MaterialIcons name={meta.icon} size={14} color={meta.color} />
          <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="person" size={18} color="#666" />
        <Text style={styles.rowText}>{item.guestName}</Text>
      </View>
      <View style={styles.row}>
        <MaterialIcons name="door-front" size={18} color="#666" />
        <Text style={styles.rowText}>Quarto {item.room}</Text>
      </View>

      <View style={styles.rowSplit}>
        <View style={styles.col}>
          <Text style={styles.kvLabel}>Check-in</Text>
          <Text style={styles.kvValue}>{fmtDate(item.checkin)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.kvLabel}>Check-out</Text>
          <Text style={styles.kvValue}>{fmtDate(item.checkout)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.kvLabel}>Total</Text>
          <Text style={styles.kvValue}>{fmtMoney(item.total)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.iconBtn} onPress={onEdit} accessibilityLabel="Editar reserva">
          <MaterialIcons name="edit" size={18} color="#333" />
          <Text style={styles.iconBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onDelete} accessibilityLabel="Excluir reserva">
          <MaterialIcons name="delete" size={18} color="#b00020" />
          <Text style={[styles.iconBtnText, { color: "#b00020" }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <View style={styles.empty}>
    <MaterialIcons name="event-busy" size={36} color="#999" />
    <Text style={styles.emptyTitle}>Você ainda não tem reservas</Text>
    <Text style={styles.emptySub}>Crie sua primeira reserva para começar</Text>
    <TouchableOpacity style={styles.primaryBtn} onPress={onCreate}>
      <Text style={styles.primaryBtnText}>Nova reserva</Text>
    </TouchableOpacity>
  </View>
);

const SkeletonList = () => (
  <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <View key={i} style={styles.skeletonCard}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "80%" }]} />
        <View style={[styles.skeletonLine, { width: "60%" }]} />
        <View style={[styles.skeletonLine, { width: "90%" }]} />
      </View>
    ))}
  </View>
);

const InputRow = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: "default" | "decimal-pad" | "numbers-and-punctuation";
}) => (
  <View style={{ marginTop: 8 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={[styles.input, !!error && { borderColor: "#b00020" }]}
      keyboardType={keyboardType || "default"}
      autoCapitalize="none"
    />
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    gap: 8,
  },
  searchBox: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFF",
  },
  searchInput: {
    flex: 1,
    color: "#222",
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#EEE",
    borderRadius: 999,
  },
  chipText: {
    color: "#333",
    fontSize: 12,
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  code: {
    fontWeight: "700",
    fontSize: 14,
    color: "#673AB7",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  rowText: {
    color: "#333",
    fontSize: 14,
  },
  rowSplit: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  col: {
    flex: 1,
  },
  kvLabel: {
    fontSize: 12,
    color: "#888",
  },
  kvValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 10,
  },
  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconBtnText: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },

  // Empty
  empty: {
    alignItems: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  emptySub: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  skeletonLine: {
    backgroundColor: "#EEE",
    height: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  // FAB
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#673AB7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  label: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    color: "#222",
  },
  errorText: {
    marginTop: 4,
    color: "#b00020",
    fontSize: 12,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFF",
  },
  stChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#673AB7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#FFF",
  },
  secondaryBtnText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default RenderReservations;