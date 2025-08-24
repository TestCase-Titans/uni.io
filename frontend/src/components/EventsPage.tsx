import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Search,
  Grid,
  List,
  CalendarDays,
  MapPin,
  Users,
  Filter,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useNavigate, useSearchParams } from "react-router-dom";

interface EventsPageProps { }

export function EventsPage({ }: EventsPageProps) {
  const navigate = useNavigate();
  const { events } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 6; // number of events per page




  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || event.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "popular":
          return b.registered - a.registered;
        case "newest":
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, categoryFilter, statusFilter, sortBy]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedEvents.slice(start, end);
  }, [filteredAndSortedEvents, currentPage]);

  const goToPage = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const categories = Array.from(new Set(events.map((event) => event.category)));

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Environment:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Career:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Arts: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ongoing:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const getPopularityBadge = (registered: number, capacity: number) => {
    const ratio = registered / capacity;
    if (ratio > 0.8)
      return {
        icon: <Star className="h-3 w-3" />,
        text: "HOT",
        color: "bg-red-500 text-white",
      };
    if (ratio > 0.6)
      return {
        icon: <TrendingUp className="h-3 w-3" />,
        text: "POPULAR",
        color: "bg-orange-500 text-white",
      };
    return null;
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="redis-heading-lg mb-4">
            DISCOVER EPIC
            <br />
            <span className="text-destructive">CAMPUS EVENTS</span>
          </h1>
          <p className="redis-subtitle text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your next adventure from hundreds of amazing events happening
            on campus
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 border-2 hover:border-destructive/20 transition-colors animate-slide-up">
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, clubs, keywords..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchParams({ page: "1" }); // reset page
                    }}

                    className="pl-10 font-medium"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                setSearchParams({ page: "1" });
              }}
              >
                <SelectTrigger className="font-medium">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL CATEGORIES</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL STATUS</SelectItem>
                  <SelectItem value="upcoming">UPCOMING</SelectItem>
                  <SelectItem value="ongoing">ONGOING</SelectItem>
                  <SelectItem value="completed">COMPLETED</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">BY DATE</SelectItem>
                  <SelectItem value="popular">MOST POPULAR</SelectItem>
                  <SelectItem value="newest">NEWEST FIRST</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle and Results */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <div className="flex items-center space-x-4">
                <p className="text-sm font-bold uppercase tracking-wide">
                  <span className="text-destructive">
                    {filteredAndSortedEvents.length}
                  </span>{" "}
                  EVENTS FOUND
                </p>
                {searchQuery && (
                  <Badge variant="outline" className="font-bold">
                    "{searchQuery}"
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="redis-button"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="redis-button"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Events Grid/List */}
        {filteredAndSortedEvents.length === 0 ? (
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="redis-heading-sm mb-4">NO EVENTS FOUND</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or filters to discover more
                events
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="redis-button border-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                <Zap className="mr-2 h-4 w-4" />
                CLEAR ALL FILTERS
              </Button>
            </div>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {paginatedEvents.map((event, index) => {
              const popularityBadge = getPopularityBadge(
                event.registered,
                event.capacity
              );

              return (
                <Card
                  key={event.id}
                  className={`cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group border-2 hover:border-destructive/20 ${viewMode === "list" ? "flex-row p-6" : ""
                    }`}
                  onClick={() => navigate(`/event/${event.id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {viewMode === "grid" ? (
                    <>
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={`${getCategoryColor(
                                event.category
                              )} font-bold`}
                            >
                              {event.category.toUpperCase()}
                            </Badge>
                            <Badge
                              className={`${getStatusColor(
                                event.status
                              )} font-bold`}
                            >
                              {event.status.toUpperCase()}
                            </Badge>
                            {popularityBadge && (
                              <Badge
                                className={`${popularityBadge.color} font-bold flex items-center space-x-1`}
                              >
                                {popularityBadge.icon}
                                <span>{popularityBadge.text}</span>
                              </Badge>
                            )}
                          </div>
                          <div className="text-right text-sm">
                            <div className="flex items-center font-bold">
                              <Users className="h-4 w-4 mr-1 text-destructive" />
                              <span className="text-destructive">
                                {event.registered}
                              </span>
                              /{event.capacity}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="redis-heading-sm line-clamp-2 group-hover:text-destructive transition-colors">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-base">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center text-muted-foreground font-medium">
                            <CalendarDays className="h-4 w-4 mr-2 text-destructive" />
                            {new Date(event.event_date).toLocaleDateString()} at{" "}
                            {event.time} until {event.endTime}
                          </div>
                          <div className="flex items-center text-muted-foreground font-medium">
                            <MapPin className="h-4 w-4 mr-2 text-destructive" />
                            {event.address}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                              BY {event.organizer}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="redis-button text-xs text-destructive hover:bg-destructive hover:text-white"
                            >
                              VIEW DETAILS →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="flex items-start space-x-6 w-full">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge
                            className={`${getCategoryColor(
                              event.category
                            )} font-bold`}
                          >
                            {event.category.toUpperCase()}
                          </Badge>
                          <Badge
                            className={`${getStatusColor(
                              event.status
                            )} font-bold`}
                          >
                            {event.status.toUpperCase()}
                          </Badge>
                          {popularityBadge && (
                            <Badge
                              className={`${popularityBadge.color} font-bold flex items-center space-x-1`}
                            >
                              {popularityBadge.icon}
                              <span>{popularityBadge.text}</span>
                            </Badge>
                          )}
                        </div>
                        <h3 className="redis-heading-sm text-xl mb-3 group-hover:text-destructive transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground font-medium">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-destructive" />
                            {new Date(event.event_date).toLocaleDateString()} at{" "}
                            {event.time} until {event.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-destructive" />
                            {event.address}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-destructive" />
                            <span className="text-destructive font-bold">
                              {event.registered}
                            </span>
                            /{event.capacity}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(filteredAndSortedEvents.length / pageSize) }).map((_, index) => {
                const page = index + 1;
                return (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
        
      </div>
    </div>
  );
}
