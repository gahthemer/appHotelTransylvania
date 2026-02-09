import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthContainer from "../ui/AuthContainer";
import DateSelector from "../ui/DateSelector";

const { width } = Dimensions.get("window");

type Room = {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  amenities: string[];
};

const SAMPLE_ROOMS: Room[] = [
  {
    id: "1",
    title: "Apartamento Vista Mar - Copacabana",
    location: "Copacabana, Rio de Janeiro",
    pricePerNight: 420,
    rating: 4.89,
    reviewsCount: 124,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    description:
      "Apartamento de 2 quartos com vista panorâmica para o mar, totalmente reformado em 2024. Excelente localização a 2 minutos da praia.",
    amenities: ["Wi-Fi grátis", "Ar-condicionado", "Cozinha completa", "Academia", "Piscina"],
  },
  // Adicione mais quartos aqui se quiser
];

const RoomCard = ({ room }: { room: Room }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: room.imageUrl }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>★ {room.rating}</Text>
        <Text style={styles.reviewsText}> · {room.reviewsCount}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title}>{room.title}</Text>
        <Text style={styles.location}>{room.location}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            R$ {room.pricePerNight}
            <Text style={styles.perNight}> / noite</Text>
          </Text>
        </View>

        {/* Botão de reserva adicionado aqui */}
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => alert(`Reservando: ${room.title}`)}
        >
          <Text style={styles.reserveButtonText}>Reservar agora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailsButtonText}>
            {expanded ? "Fechar detalhes" : "Ver detalhes"}
          </Text>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{room.description}</Text>

            <Text style={styles.amenitiesTitle}>Comodidades</Text>
            <View style={styles.amenitiesContainer}>
              {room.amenities.map((item, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const RenderExplorer = () => {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [calendar, setCalendar] = useState<"checkin" | "checkout" | null>(null);

  return (
    <AuthContainer>
      {/* Busca / Filtros */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => setCalendar("checkin")}
        >
          <Text style={styles.label}>Check-in</Text>
          <Text style={styles.value}>{checkIn || "Selecione"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputButton}
          onPress={() => setCalendar("checkout")}
        >
          <Text style={styles.label}>Check-out</Text>
          <Text style={styles.value}>{checkOut || "Selecione"}</Text>
        </TouchableOpacity>
      </View>

      {/* Seletor de hóspedes */}
      <View style={styles.guestsContainer}>
        <Text style={styles.label}>Hóspedes</Text>
        <View style={styles.guestsRow}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setGuests((prev) => Math.max(1, prev - 1))}
          >
            <Text style={styles.adjustText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.guestsCount}>
            {guests} {guests === 1 ? "hóspede" : "hóspedes"}
          </Text>

          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setGuests((prev) => prev + 1)}
          >
            <Text style={styles.adjustText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendário aparece aqui embaixo */}
      {calendar && (
        <View style={styles.calendarWrapper}>
          <DateSelector
            onSelectDate={(date: string) => {
              if (calendar === "checkin") setCheckIn(date);
              if (calendar === "checkout") setCheckOut(date);
              setCalendar(null);
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCalendar(null)}
          >
            <Text style={styles.closeButtonText}>Fechar calendário</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de acomodações */}
      <View style={styles.list}>
        {SAMPLE_ROOMS.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inputButton: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  guestsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  guestsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  adjustText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  guestsCount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  calendarWrapper: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  closeButtonText: {
    color: "#0066ff",
    fontWeight: "600",
    fontSize: 16,
  },
  list: {
    gap: 20,
  },

  // ── Estilos do Card ───────────────────────────────────────
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: 220,
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewsText: {
    color: "#ddd",
    fontSize: 13,
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  location: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
  },
  priceRow: {
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  perNight: {
    fontSize: 14,
    fontWeight: "400",
    color: "#777",
  },
  detailsButton: {
    backgroundColor: "#f0f4ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#0066ff",
    fontWeight: "600",
    fontSize: 15,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#222",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityTag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amenityText: {
    fontSize: 13,
    color: "#334155",
  },

  // Estilos novos (apenas para o botão de reserva)
  reserveButton: {
    backgroundColor: "#ff385c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  reserveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RenderExplorer;