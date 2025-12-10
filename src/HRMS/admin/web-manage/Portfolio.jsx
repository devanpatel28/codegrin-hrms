import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { portfolioAPI, categoryAPI } from "@/utils/api";
import { ROUTES } from "@/constants/RoutesContants";
import { ICON_ASSETS } from "@/constants/IconConstant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminPortfolio() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [portfolioRes, categoryRes] = await Promise.all([
        portfolioAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setPortfolios(portfolioRes.data.portfolios || []);
      setCategories(categoryRes.data.categories || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load portfolios. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted portfolios
  const filteredPortfolios = useMemo(() => {
    let filtered = [...portfolios];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.slug?.toLowerCase().includes(query) ||
          p.publisher_name?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) =>
        p.categories?.some((cat) => cat.slug === selectedCategory)
      );
    }

    // Project type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.project_type === selectedType);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [portfolios, searchQuery, selectedCategory, selectedType, sortBy]);

  const handleAddNew = () => {
    navigate(ROUTES.ADMIN.WEBSITE_MANAGE.ADD_PORTFOLIO);
  };

  const handleView = (portfolio) => {
    navigate(`${ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO}/${portfolio.id}`);
  };
//   const handleLiveView = (portfolio) => {
//   window.open(`${ROUTES.PROJECT_DETAILS}/${portfolio.slug}`, "_blank");
// };





  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedType !== "all" ||
    sortBy !== "newest";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="large" />
          <p className="text-white text-sm">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Main Content */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  Portfolio Management
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  {filteredPortfolios.length} of {portfolios.length} projects
                </CardDescription>
              </div>
              <Button
                onClick={handleAddNew}
                className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer"
              >
                <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
                Add New Portfolio
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              {/* Search */}
              <div className="w-full relative">
                <Icon
                  icon={ICON_ASSETS.SEARCH}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none"
                />
                <Input
                  placeholder="Search by title, slug, or publisher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="md:col-span-3">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="all" className="text-white">
                      All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.slug}
                        className="text-white capitalize"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-2 ">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    <SelectItem value="newest" className="text-white">
                      Newest First
                    </SelectItem>
                    <SelectItem value="oldest" className="text-white">
                      Oldest First
                    </SelectItem>
                    <SelectItem value="title-asc" className="text-white">
                      Title (A-Z)
                    </SelectItem>
                    <SelectItem value="title-desc" className="text-white">
                      Title (Z-A)
                    </SelectItem>
                  </SelectContent>  
                </Select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="md:col-span-1">
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="w-full text-white hover:bg-neutral-800"
                    title="Clear all filters"
                  >
                    <Icon icon="mdi:filter-off" className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <Icon
                icon="mdi:alert-circle"
                className="w-5 h-5 text-red-400 flex-shrink-0"
              />
              <p className="text-red-400 text-sm">{error}</p>
              <Button
                onClick={fetchData}
                variant="ghost"
                size="sm"
                className="ml-auto text-red-400 hover:bg-red-500/10"
              >
                Retry
              </Button>
            </div>
          )}

          {portfolios.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                <Icon
                  icon={ICON_ASSETS.PORTFOLIO}
                  className="w-10 h-10 text-neutral-600"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No portfolios yet
              </h3>
              <p className="text-white text-sm mb-6 max-w-md mx-auto">
                Get started by creating your first portfolio project to showcase
                your work
              </p>
              <Button
                onClick={handleAddNew}
                className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer"
              >
                <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
                Create First Portfolio
              </Button>
            </div>
          ) : filteredPortfolios.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                <Icon
                  icon="mdi:file-search"
                  className="w-10 h-10 text-neutral-600"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No results found
              </h3>
              <p className="text-white text-sm mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={clearFilters}
                className="bg-primary text-white hover:bg-primary/50 cursor-pointer"
              >
                <Icon icon="mdi:filter-off" className="w-5 h-5 mr-2" />
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800 hover:bg-transparent">
                    <TableHead className="text-white font-semibold w-16">
                      #
                    </TableHead>
                    <TableHead className="text-white font-semibold w-20">
                      Image
                    </TableHead>
                    <TableHead className="text-white font-semibold min-w-[200px]">
                      Title
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Publisher
                    </TableHead>
                    <TableHead className="text-white font-semibold  w-32">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPortfolios.map((portfolio, index) => (
                    <TableRow
                      key={portfolio.id}
                      className="border-neutral-800 hover:bg-neutral-800/50 transition-colors group"
                    >
                      <TableCell className="text-white font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="w-32 h-16 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
                          {portfolio.header_image_url ? (
                            <img
                              src={portfolio.header_image_url}
                              alt={portfolio.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              onError={(e) => {
                                e.target.src = "/placeholder.webp";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon
                                icon="mdi:image-off"
                                className="w-6 h-6 text-neutral-600"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-medium">
                            {portfolio.title}
                          </span>
                          <span className="text-white text-xs mt-1 flex items-center gap-1">
                           <div className="flex flex-wrap gap-1">
                          {portfolio.categories?.map((cat, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-primary/20 text-primary-light border-0 text-xs"
                            >
                              {cat.name}
                            </Badge>
                          ))}
                          
                        </div>
                          </span>
                        </div>
                      </TableCell>
                    
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize border-neutral-700 text-white"
                        >
                          {portfolio.project_type || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-white text-sm">
                          {portfolio.publisher_name || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                       <div className="flex items-center gap-2">
                         {/* <Button
                          onClick={() => handleLiveView(portfolio)}
                          className="text-white border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                        >
                          <Icon icon={ICON_ASSETS.EYE} className="w-4 h-4 mr-2" />
                          View Live
                        </Button> */}
                         <Button
                          onClick={() => handleView(portfolio)}
                          className="text-white border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                        >
                          <Icon icon={ICON_ASSETS.EYE} className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                       </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
